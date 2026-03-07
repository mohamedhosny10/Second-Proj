angular
  .module('pharmacyApp.services')
  .factory('landingService', [
    '$q',
    'supabaseService',
    function ($q, supabaseService) {
      var client = supabaseService.client;

      function searchMedicines(nameTerm) {
        var deferred = $q.defer();
        var query = client
          .from('medicines')
          .select('id, name, price, stock_quantity, category')
          .order('name', { ascending: true });

        if (nameTerm && String(nameTerm).trim()) {
          query = query.ilike('name', '%' + String(nameTerm).trim() + '%');
        }

        query
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Search failed');
            } else {
              deferred.resolve(result.data || []);
            }
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Search failed');
          });

        return deferred.promise;
      }

      return {
        searchMedicines: searchMedicines
      };
    }
  ]);
