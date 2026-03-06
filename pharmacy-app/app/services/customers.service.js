angular
  .module('pharmacyApp.services')
  .factory('customersService', [
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
        var query = client.from('customers').select('*').order('full_name', { ascending: true });

        if (searchTerm) {
          query = query.ilike('full_name', '%' + searchTerm + '%');
        }

        query
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load customers');
          });

        return deferred.promise;
      }

      function getById(id) {
        var deferred = $q.defer();

        client
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load customer');
          });

        return deferred.promise;
      }

      function create(payload) {
        var deferred = $q.defer();

        client
          .from('customers')
          .insert(payload)
          .select()
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to create customer');
          });

        return deferred.promise;
      }

      function update(id, payload) {
        var deferred = $q.defer();

        client
          .from('customers')
          .update(payload)
          .eq('id', id)
          .select()
          .single()
          .then(function (result) {
            handleResult(deferred, result);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to update customer');
          });

        return deferred.promise;
      }

    function remove(id) {
      var deferred = $q.defer();

     client
      .from('customers')
      .delete()
      .eq('id', id)
      .then(function (result) {
        handleResult(deferred, result);
    })
    .catch(function (err) {
      deferred.reject(err.message || 'Failed to delete customer');
    });

    return deferred.promise;
  }
  
  function getPurchaseHistory(customerId) {
  var deferred = $q.defer();

  client
    .from('invoices')
    .select('*, invoice_items(*, medicines(name, price))')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .then(function (result) {
      handleResult(deferred, result);
    })
    .catch(function (err) {
      deferred.reject(err.message || 'Failed to load purchase history');
    });

  return deferred.promise;
}

      return {
        getAll: getAll,
        getById: getById,
        create: create,
        update: update,
        remove: remove,
        getPurchaseHistory:getPurchaseHistory
      };

    
    }
  ]);

