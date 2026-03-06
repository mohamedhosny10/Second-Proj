angular
  .module('pharmacyApp.controllers')
  .controller('CreateInvoiceController', [
    '$location',
    'authService',
    'customersService',
    'medicinesService',
    'invoicesService',
    function ($location, authService, customersService, medicinesService, invoicesService) {
      var vm = this;
      vm.title = 'Create Invoice';
      vm.customers = [];
      vm.medicines = [];
      vm.selectedCustomerId = null;
      vm.items = [];
      vm.loading = false;
      vm.error = null;

      vm.loadCustomers = function () {
        customersService.getAll().then(function (data) {
          vm.customers = data || [];
        }).catch(function (err) {
          vm.error = err;
        });
      };

      vm.loadMedicines = function () {
        medicinesService.getAll().then(function (data) {
          vm.medicines = data || [];
        }).catch(function (err) {
          vm.error = err;
        });
      };

      vm.addItem = function () {
        vm.items.push({
          medicine_id: null,
          medicine: null,
          quantity: 1,
          price: 0
        });
      };

      vm.removeItem = function (index) {
        vm.items.splice(index, 1);
      };

      vm.onMedicineSelect = function (item) {
        var m = vm.medicines.find(function (x) { return x.id === item.medicine_id; });
        if (m) {
          item.medicine = m;
          item.price = m.price;
        }
      };

      vm.calcTotal = function () {
        var sum = 0;
        vm.items.forEach(function (i) {
          sum += (i.quantity || 0) * (i.price || 0);
        });
        return sum;
      };

      vm.submit = function () {
        if (!vm.selectedCustomerId || !vm.items.length) {
          vm.error = 'Select a customer and add at least one item.';
          return;
        }
        vm.loading = true;
        vm.error = null;

        var user = authService.getCurrentUser();
        var createdBy = user && user.user && user.user.id ? user.user.id : null;

        var payload = {
          customer_id: vm.selectedCustomerId,
          created_by: createdBy,
          total_amount: vm.calcTotal(),
          items: vm.items.map(function (i) {
            return {
              medicine_id: i.medicine_id,
              quantity: i.quantity,
              price: i.price
            };
          })
        };

        invoicesService.createInvoice(payload)
          .then(function () {
            vm.loading = false;
            $location.path('/dashboard');
          })
          .catch(function (err) {
            vm.loading = false;
            vm.error = err;
          });
      };

      vm.loadCustomers();
      vm.loadMedicines();
    }
  ]);
