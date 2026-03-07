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

      function getAnalytics() {
        var deferred = $q.defer();

        function getInvoicesForSum() {
          return client.from('invoices').select('total_amount, created_at');
        }

        function getOutOfStockCount() {
          return client
            .from('medicines')
            .select('*', { count: 'exact', head: true })
            .lte('stock_quantity', 0)
            .then(function (r) {
              return r.error ? 0 : (r.count || 0);
            });
        }

        getInvoicesForSum()
          .then(function (invResult) {
            if (invResult.error) {
              deferred.reject(invResult.error.message || 'Failed to load invoices');
              return;
            }
            var rows = invResult.data || [];
            var totalSales = rows.reduce(function (sum, row) {
              return sum + (parseFloat(row.total_amount) || 0);
            }, 0);
            var now = new Date();
            var currentMonth = now.getFullYear() * 100 + (now.getMonth() + 1);
            var monthlyRevenue = rows.reduce(function (sum, row) {
              var d = row.created_at ? new Date(row.created_at) : null;
              if (!d) return sum;
              var m = d.getFullYear() * 100 + (d.getMonth() + 1);
              return m === currentMonth ? sum + (parseFloat(row.total_amount) || 0) : sum;
            }, 0);
            return getOutOfStockCount().then(function (outOfStock) {
              deferred.resolve({
                totalSales: totalSales,
                activePrescriptions: rows.length,
                outOfStockCount: outOfStock,
                monthlyRevenue: monthlyRevenue
              });
            });
          })
          .catch(function (err) {
            deferred.reject(err && err.message ? err.message : 'Failed to load analytics');
          });

        return deferred.promise;
      }

      function getRevenueTrend(monthsCount) {
        monthsCount = monthsCount || 12;
        var deferred = $q.defer();

        client
          .from('invoices')
          .select('total_amount, created_at')
          .order('created_at', { ascending: true })
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Failed to load revenue data');
              return;
            }
            var rows = result.data || [];
            var keys = [];
            var labels = [];
            var now = new Date();
            for (var i = monthsCount - 1; i >= 0; i--) {
              var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
              keys.push(key);
              labels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
            }
            var byMonth = {};
            keys.forEach(function (k) { byMonth[k] = 0; });
            rows.forEach(function (row) {
              var created = row.created_at ? new Date(row.created_at) : null;
              if (!created) return;
              var key = created.getFullYear() + '-' + String(created.getMonth() + 1).padStart(2, '0');
              if (byMonth[key] !== undefined) {
                byMonth[key] += parseFloat(row.total_amount) || 0;
              }
            });
            var data = keys.map(function (k) { return byMonth[k] || 0; });
            deferred.resolve({ labels: labels, data: data });
          })
          .catch(function (err) {
            deferred.reject(err && err.message ? err.message : 'Failed to load revenue trend');
          });

        return deferred.promise;
      }

      function getInventoryStatus() {
        var deferred = $q.defer();
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        client
          .from('medicines')
          .select('stock_quantity, expiry_date')
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Failed to load inventory');
              return;
            }
            var rows = result.data || [];
            var available = 0, lowStock = 0, expired = 0;
            rows.forEach(function (row) {
              var qty = parseInt(row.stock_quantity, 10) || 0;
              var exp = row.expiry_date ? new Date(row.expiry_date) : null;
              if (exp && exp.setHours(0, 0, 0, 0) < today) {
                expired++;
              } else if (qty > 10) {
                available++;
              } else if (qty >= 1) {
                lowStock++;
              }
            });
            deferred.resolve({ available: available, lowStock: lowStock, expired: expired });
          })
          .catch(function (err) {
            deferred.reject(err && err.message ? err.message : 'Failed to load inventory status');
          });

        return deferred.promise;
      }

      function getRecentTransactions(limit) {
        limit = limit || 10;
        var deferred = $q.defer();

        client
          .from('invoices')
          .select('*, customers(full_name)')
          .order('created_at', { ascending: false })
          .limit(limit)
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Failed to load transactions');
            } else {
              deferred.resolve(result.data || []);
            }
          })
          .catch(function (err) {
            deferred.reject(err && err.message ? err.message : 'Failed to load transactions');
          });

        return deferred.promise;
      }

      return {
        getOverview: getOverview,
        getAnalytics: getAnalytics,
        getRevenueTrend: getRevenueTrend,
        getInventoryStatus: getInventoryStatus,
        getRecentTransactions: getRecentTransactions
      };
    }
  ]);

