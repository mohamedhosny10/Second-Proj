angular
  .module('pharmacyApp.services')
  .factory('dashboardService', [
    '$q',
    'supabaseService',
    function ($q, supabaseService) {
      var client = supabaseService.client;

      function getCount(table) {
        return client
          .from(table)
          .select('*', { count: 'exact', head: true })
          .then(function (result) {
            if (result.error) {
              var msg = result.error.message || result.error.hint || 'Failed to load count';
              throw new Error(msg + ' (' + table + ')');
            }
            return result.count || 0;
          });
      }

      function getLowStockCount(threshold) {
        return client
          .from('medicines')
          .select('*', { count: 'exact', head: true })
          .lte('stock_quantity', threshold)
          .then(function (result) {
            if (result.error) {
              throw new Error(result.error.message || 'Failed to load low stock count');
            }
            return result.count || 0;
          });
      }

      function getOverview() {
        var deferred = $q.defer();

        Promise.all([
          getCount('medicines'),
          getCount('customers'),
          getCount('invoices'),
          getLowStockCount(10)
        ])
          .then(function (values) {
            deferred.resolve({
              totalMedicines: values[0],
              totalCustomers: values[1],
              totalInvoices: values[2],
              lowStockCount: values[3]
            });
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load dashboard data');
          });

        return deferred.promise;
      }

      return {
        getOverview: getOverview
      };
    }
  ]);

