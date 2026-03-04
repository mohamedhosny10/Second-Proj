angular
  .module('pharmacyApp.services')
  .factory('invoicesService', [
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
          .from('invoices')
          .select('*, customers(full_name)')
          .order('created_at', { ascending: false })
          .then(function (result) {
            handleResult(deferred, result, 'Failed to load invoices');
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load invoices');
          });

        return deferred.promise;
      }

      function getById(id) {
        var deferred = $q.defer();

        client
          .from('invoices')
          .select('*, customers(*), invoice_items(*, medicines(name, price))')
          .eq('id', id)
          .single()
          .then(function (result) {
            handleResult(deferred, result, 'Failed to load invoice');
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to load invoice');
          });

        return deferred.promise;
      }

      function validateStock(items) {
        var deferred = $q.defer();
        var medicineIds = items.map(function (i) {
          return i.medicine_id;
        });

        client
          .from('medicines')
          .select('id, stock_quantity, name')
          .in('id', medicineIds)
          .then(function (result) {
            if (result.error) {
              deferred.reject(result.error.message || 'Failed to validate stock');
              return;
            }

            var data = result.data || [];
            var byId = {};
            data.forEach(function (m) {
              byId[m.id] = m;
            });

            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              var m = byId[item.medicine_id];
              if (!m) {
                deferred.reject('Medicine not found for one of the items');
                return;
              }
              var remaining = m.stock_quantity - item.quantity;
              if (remaining < 0) {
                deferred.reject('Not enough stock for ' + m.name);
                return;
              }
            }

            deferred.resolve(byId);
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to validate stock');
          });

        return deferred.promise;
      }

      function decreaseStock(stockMap, items) {
        var deferred = $q.defer();
        var promises = [];

        items.forEach(function (item) {
          var current = stockMap[item.medicine_id];
          if (!current) {
            return;
          }
          var newQty = current.stock_quantity - item.quantity;
          promises.push(
            client
              .from('medicines')
              .update({ stock_quantity: newQty })
              .eq('id', item.medicine_id)
          );
        });

        Promise.all(promises)
          .then(function () {
            deferred.resolve();
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to update stock');
          });

        return deferred.promise;
      }

      function createInvoice(payload) {
        var deferred = $q.defer();
        var items = payload.items || [];

        if (!items.length) {
          deferred.reject('Invoice must contain at least one item');
          return deferred.promise;
        }

        validateStock(items)
          .then(function (stockMap) {
            return client
              .from('invoices')
              .insert({
                customer_id: payload.customer_id,
                created_by: payload.created_by,
                total_amount: payload.total_amount
              })
              .select()
              .single()
              .then(function (result) {
                if (result.error) {
                  throw new Error(result.error.message || 'Failed to create invoice');
                }
                return { invoice: result.data, stockMap: stockMap };
              });
          })
          .then(function (ctx) {
            var invoice = ctx.invoice;
            var stockMap = ctx.stockMap;

            var rows = items.map(function (item) {
              return {
                invoice_id: invoice.id,
                medicine_id: item.medicine_id,
                quantity: item.quantity,
                price: item.price
              };
            });

            return client
              .from('invoice_items')
              .insert(rows)
              .then(function (result) {
                if (result.error) {
                  throw new Error(result.error.message || 'Failed to create invoice items');
                }
                return { invoice: invoice, stockMap: stockMap };
              });
          })
          .then(function (ctx) {
            return decreaseStock(ctx.stockMap, items).then(function () {
              deferred.resolve();
            });
          })
          .catch(function (err) {
            deferred.reject(err.message || 'Failed to create invoice');
          });

        return deferred.promise;
      }

      return {
        getAll: getAll,
        getById: getById,
        createInvoice: createInvoice
      };
    }
  ]);

