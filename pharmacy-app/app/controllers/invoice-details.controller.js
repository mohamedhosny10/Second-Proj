angular
  .module('pharmacyApp.controllers')
  .controller('InvoiceDetailsController', [
    '$routeParams',
    'invoicesService',
    function ($routeParams, invoicesService) {
      var vm = this;
      vm.title = 'Invoice Details';
      vm.invoice = null;
      vm.loading = false;
      vm.error = null;

      vm.load = function () {
        vm.loading = true;
        vm.error = null;
        invoicesService.getById($routeParams.id)
          .then(function (data) {
            vm.invoice = data;
            vm.loading = false;
          })
          .catch(function (err) {
            vm.error = (err && err.message) ? err.message : 'Failed to load invoice';
            vm.loading = false;
          });
      };

      vm.load();
    }
  ]);
