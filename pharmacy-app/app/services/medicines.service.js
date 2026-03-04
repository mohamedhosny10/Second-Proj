angular
  .module('pharmacyApp.services')
  .factory('medicinesService', [
    '$q',
    'supabaseService',
    function ($q, supabaseService) {
      var client = supabaseService.client;

      function handleResult(deferred, result) {
        if (result.error) {
          deferred.reject(result.error.message || 'Request failed');
        } else {
          deferred.resolve(result.data || null);
        }
      }

      function getAll(searchTerm) {
        var deferred = $q.defer();
        var query = client.from('medicines').select('*').order('name', { ascending: true });

        if (searchTerm) {
          query = query.ilike('name', '%' + searchTerm + '%');
        }

        query
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load medicines');
          });

        return deferred.promise;
      }

      function getById(id) {
        var deferred = $q.defer();

        client
          .from('medicines')
          .select('*')
          .eq('id', id)
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load medicine');
          });

        return deferred.promise;
      }

      function create(payload) {
        var deferred = $q.defer();

        client
          .from('medicines')
          .insert(payload)
          .select()
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to create medicine');
          });

        return deferred.promise;
      }

      function update(id, payload) {
        var deferred = $q.defer();

        client
          .from('medicines')
          .update(payload)
          .eq('id', id)
          .select()
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to update medicine');
          });

        return deferred.promise;
      }

      function remove(id) {
        var deferred = $q.defer();

        client
          .from('medicines')
          .delete()
          .eq('id', id)
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to delete medicine');
          });

        return deferred.promise;
      }

      function getLowStock(threshold) {
        var deferred = $q.defer();

        client
          .from('medicines')
          .select('*')
          .lte('stock_quantity', threshold)
          .order('stock_quantity', { ascending: true })
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load low stock medicines');
          });

        return deferred.promise;
      }

      return {
        getAll: getAll,
        getById: getById,
        create: create,
        update: update,
        remove: remove,
        getLowStock: getLowStock
      };
    }
  ]);

