angular
  .module('pharmacyApp.controllers')
  .controller('CustomersController', [
    '$location',
    '$route',
    '$routeParams',
    'customersService',
    function ($location, $route, $routeParams, customersService) {
      var vm = this;

      vm.customers = [];
      vm.customer = {};
      vm.searchText = '';
      vm.isEdit = !!$routeParams.id;
      vm.errorMessage = '';
      vm.load = load;
      vm.save = save;
      vm.deleteCustomer = deleteCustomer;
      vm.search = search;

      if (vm.isEdit) {
        customersService.getById($routeParams.id)
          .then(function (data) {
            vm.customer = data || {};
          })
          .catch(function (err) {
            vm.errorMessage = err || 'Failed to load customer';
          });
      } else if ($route.current && $route.current.originalPath.indexOf('new') !== -1) {
        vm.customer = {};
      } else {
        load();
      }

      function load() {
        customersService.getAll()
          .then(function (data) {
            vm.customers = data || [];
          })
          .catch(function (err) {
            vm.errorMessage = err || 'Failed to load customers';
          });
      }

      function deleteCustomer(id) {
        customersService.remove(id)
          .then(function () {
            load(); 
          })
          .catch(function (err) {
            vm.errorMessage = err || 'Failed to delete customer';
          });
      }

      function search() {
        if (!vm.searchText) {
          load(); 
          return;
        }
        customersService.getAll(vm.searchText)
          .then(function (data) {
            vm.customers = data || [];
          })
          .catch(function (err) {
            vm.errorMessage = err || 'Search failed';
          });
      }

      function save(form) {
        if (form.$invalid) return;

        vm.errorMessage = '';

        var promise = vm.isEdit
          ? customersService.update(vm.customer.id, vm.customer)
          : customersService.create(vm.customer);

        promise
          .then(function () {
            $location.path('/customers'); 
          })
          .catch(function (err) {
            vm.errorMessage = err || 'Failed to save customer';
          });
      }
    }
  ]);