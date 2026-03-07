angular
  .module('pharmacyApp.services')
  .factory('authService', [
    '$q',
    '$window',
    '$location',
    '$rootScope',
    'supabaseService',
    function ($q, $window, $location, $rootScope, supabaseService) {
      var STORAGE_KEY = 'pharmacyApp.session';
      var client = supabaseService.client;
      var currentUser = null;

      function loadSessionFromStorage() {
        var raw = $window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
          var stored = JSON.parse(raw);
          currentUser = stored;
          if (stored.access_token && stored.refresh_token) {
            client.auth.setSession({
              access_token: stored.access_token,
              refresh_token: stored.refresh_token
            });
          }
        } catch (e) {
          $window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      function persistSession(session, role) {
        var payload = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          user: {
            id: session.user && session.user.id,
            email: session.user && session.user.email
          },
          role: role || 'user'
        };
        currentUser = payload;
        $window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      function clearSession() {
        currentUser = null;
        $window.localStorage.removeItem(STORAGE_KEY);
      }

      loadSessionFromStorage();

      function signUp(credentials) {
        var deferred = $q.defer();
        client.auth
          .signUp({
            email: credentials.email,
            password: credentials.password,
            options: credentials.full_name ? { data: { full_name: credentials.full_name } } : undefined
          })
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Sign up failed');
              return;
            }
            var user = result.data && result.data.user;
            if (!user) {
              deferred.reject('No user returned');
              return;
            }
            client
              .from('users')
              .insert({
                id: user.id,
                full_name: credentials.full_name || null,
                email: user.email,
                role: 'staff'
              })
              .then(function (insertResult) {
                if (insertResult.error) {
                  deferred.resolve(result.data);
                  return;
                }
                deferred.resolve(result.data);
              })
              .catch(function () {
                deferred.resolve(result.data);
              });
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Sign up failed');
          });
        return deferred.promise;
      }

      function fetchRoleFromDb(userId) {
        var d = $q.defer();
        if (!userId) {
          d.resolve('user');
          return d.promise;
        }
        client
          .from('users')
          .select('role')
          .eq('id', userId)
          .single()
          .then(function (res) {
            if (res.error || !res.data) {
              d.resolve('user');
            } else {
              d.resolve(res.data.role === 'admin' ? 'admin' : (res.data.role === 'staff' ? 'staff' : 'user'));
            }
          })
          .catch(function () {
            d.resolve('user');
          });
        return d.promise;
      }

      function login(credentials) {
        var deferred = $q.defer();

        client.auth
          .signInWithPassword({
            email: credentials.email,
            password: credentials.password
          })
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Login failed');
              return;
            }

            var session = result.data && result.data.session;
            if (!session) {
              deferred.reject('No session returned from server');
              return;
            }

            var userId = session.user && session.user.id;
            var email = session.user && session.user.email;
            fetchRoleFromDb(userId).then(function (role) {
              if (email === 'admin@example.com') role = 'admin';
              persistSession(session, role);
              $rootScope.$broadcast('auth:login');
              $location.path('/dashboard');
              deferred.resolve(session);
            });
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Login failed');
          });

        return deferred.promise;
      }

      function refreshUserRole() {
        var deferred = $q.defer();
        if (!currentUser || !currentUser.user || !currentUser.user.id) {
          deferred.resolve();
          return deferred.promise;
        }
        fetchRoleFromDb(currentUser.user.id).then(function (role) {
          if (currentUser) {
            if (currentUser.user && currentUser.user.email === 'admin@example.com') role = 'admin';
            currentUser.role = role;
            $window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
            $rootScope.$broadcast('auth:roleUpdated');
          }
          deferred.resolve();
        });
        return deferred.promise;
      }

      function logout() {
        var deferred = $q.defer();

        client.auth
          .signOut()
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Logout failed');
              return;
            }
            clearSession();
            $rootScope.$applyAsync(function () {
              $rootScope.$broadcast('auth:logout');
              $location.path('/login');
            });
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Logout failed');
          });

        return deferred.promise;
      }

      function isAuthenticated() {
        return !!(currentUser && currentUser.access_token);
      }

      function getCurrentUserRole() {
        if (!currentUser) {
          return 'guest';
        }
        return currentUser.role || 'user';
      }

      function getCurrentUser() {
        return currentUser;
      }

      return {
        signUp: signUp,
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        getCurrentUserRole: getCurrentUserRole,
        getCurrentUser: getCurrentUser,
        refreshUserRole: refreshUserRole
      };
    }
  ]);

