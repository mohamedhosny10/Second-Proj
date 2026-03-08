angular
  .module("pharmacyApp.controllers")
  .controller("CreateInvoiceController", [
    "$location",
    "authService",
    "customersService",
    "medicinesService",
    "invoicesService",
    function (
      $location,
      authService,
      customersService,
      medicinesService,
      invoicesService,
    ) {
      var vm = this;
      vm.title = "Create Invoice";
      vm.customers = [];
      vm.medicines = [];
      vm.selectedCustomerId = null;
      vm.items = [];
      vm.total = 0;
      vm.loading = false;
      vm.error = null;

      vm.loadCustomers = function () {
        customersService
          .getAll()
          .then(function (data) {
            vm.customers = data || [];
          })
          .catch(function (err) {
            vm.error =
              err && err.message
                ? err.message
                : String(err || "Failed to load customers");
          });
      };

      vm.loadMedicines = function () {
        medicinesService
          .getAll()
          .then(function (data) {
            vm.medicines = data || [];
          })
          .catch(function (err) {
            vm.error =
              err && err.message
                ? err.message
                : String(err || "Failed to load medicines");
          });
      };

      vm.addItem = function () {
        vm.items.push({
          medicine_id: null,
          medicine: null,
          quantity: 1,
          price: 0,
        });
        vm.updateTotal();
      };

      vm.removeItem = function (index) {
        vm.items.splice(index, 1);
        vm.updateTotal();
      };

      vm.updateTotal = function () {
        var sum = 0;
        vm.items.forEach(function (i) {
          sum += (i.quantity || 0) * (i.price || 0);
        });
        vm.total = sum;
      };

      vm.onMedicineSelect = function (item) {
        var m = vm.medicines.find(function (x) {
          return x.id === item.medicine_id;
        });
        if (m) {
          item.medicine = m;
          item.price = m.price;
        }
        vm.updateTotal();
      };

      vm.submit = function () {
        if (!vm.selectedCustomerId || !vm.items.length) {
          vm.error = "Select a customer and add at least one item.";
          return;
        }
        vm.loading = true;
        vm.error = null;

        var user = authService.getCurrentUser();
        var createdBy = user && user.user && user.user.id ? user.user.id : null;

        var payload = {
          customer_id: vm.selectedCustomerId,

          total_amount: vm.total,
          items: vm.items.map(function (i) {
            return {
              medicine_id: i.medicine_id,
              quantity: i.quantity,
              price: i.price,
            };
          }),
        };

        vm.showSuccessModal = false;

        invoicesService
          .createInvoice(payload)
          .then(function () {
            vm.loading = false;
            vm.showSuccessModal = true;
          })
          .catch(function (err) {
            vm.loading = false;
            vm.error =
              err && err.message
                ? err.message
                : String(err || "Failed to create invoice");
          });
      };

      vm.closeModalAndRedirect = function () {
        vm.showSuccessModal = false;
        $location.path("/dashboard");
      };

      vm.loadCustomers();
      vm.loadMedicines();
    },
  ]);
