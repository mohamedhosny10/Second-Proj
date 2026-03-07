angular
  .module('pharmacyApp.services')
  .factory('usersService', [
    '$q',
    'supabaseService',
    function ($q, supabaseService) {
      var client = supabaseService.client;

      function handleResult(deferred, result, defaultMessage) {
        if (result.error) {
          deferred.reject(result.error.message || defaultMessage);
        } else {
          deferred.resolve(result.data || null);
        }
      }

      function getAll() {
        var deferred = $q.defer();
        client
          .from('users')
          .select('id, full_name, email, role')
          .order('email', { ascending: true })
          .then(function (result) {
            handleResult(deferred, result, 'Failed to load users');
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load users');
          });
        return deferred.promise;
      }

      function updateRole(userId, role) {
        var deferred = $q.defer();
        if (role !== 'user' && role !== 'staff' && role !== 'admin') {
          deferred.reject('Invalid role');
          return deferred.promise;
        }
        client
          .from('users')
          .update({ role: role })
          .eq('id', userId)
          .select()
          .single()
          .then(function (result) {
            handleResult(deferred, result, 'Failed to update role');
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to update role');
          });
        return deferred.promise;
      }

      return {
        getAll: getAll,
        updateRole: updateRole
      };
    }
  ]);
