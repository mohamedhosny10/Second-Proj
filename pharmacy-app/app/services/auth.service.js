angular
  .module('pharmacyApp.services')
  .factory('authService', [
    '$q',
    '$window',
    '$location',
    'supabaseService',
    function ($q, $window, $location, supabaseService) {
      var STORAGE_KEY = 'pharmacyApp.session';
      var client = supabaseService.client;
      var currentUser = null;

      function loadSessionFromStorage() {
        var raw = $window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        try {
          var stored = JSON.parse(raw);
          currentUser = stored;
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

            var role = 'user';
            if (session.user && session.user.email === 'admin@example.com') {
              role = 'admin';
            }

            persistSession(session, role);
            $location.path('/dashboard');
            deferred.resolve(session);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Login failed');
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
            $location.path('/login');
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
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        getCurrentUserRole: getCurrentUserRole,
        getCurrentUser: getCurrentUser
      };
    }
  ]);

