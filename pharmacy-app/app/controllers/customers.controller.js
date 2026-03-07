angular
  .module('pharmacyApp.controllers')
  .controller('CustomersController', [
    '$route',
    '$routeParams',
    'customersService',
    function ($route, $routeParams, customersService) {
      var vm = this;
      vm.customers = [];
      vm.customer = {};
      vm.searchText = '';
      vm.errorMessage = '';
      vm.load = load;
      vm.deleteCustomer = deleteCustomer;
      vm.search = search;
      vm.confirmDelete = confirmDelete;
      vm.history = [];
      vm.isHistory = $route.current && $route.current.originalPath && $route.current.originalPath.indexOf('history') !== -1;
      vm.showEditModal = false;
      vm.editModel = {};
      vm.savingEdit = false;
      vm.modalIsEdit = false;
      vm.openEditModal = openEditModal;
      vm.closeEditModal = closeEditModal;
      vm.saveEdit = saveEdit;

      function errMsg(err, fallback) {
        return (err && err.message) ? err.message : (err || fallback);
      }

      if (vm.isHistory && $routeParams.id) {
        customersService.getById($routeParams.id)
          .then(function (data) { vm.customer = data || {}; })
          .catch(function (err) { vm.errorMessage = errMsg(err, 'Failed to load customer'); });
        customersService.getPurchaseHistory($routeParams.id)
          .then(function (data) { vm.history = data || []; })
          .catch(function (err) { vm.errorMessage = errMsg(err, 'Failed to load history'); });
      } else {
        load();
      }

      function load() {
        vm.loading = true;
        customersService.getAll()
          .then(function (data) { vm.customers = data || []; })
          .catch(function (err) { vm.errorMessage = errMsg(err, 'Failed to load customers'); })
          .finally(function () { vm.loading = false; });
      }

      function deleteCustomer(id) {
        customersService.remove(id)
          .then(load)
          .catch(function (err) { vm.errorMessage = errMsg(err, 'Failed to delete customer'); });
      }

      function confirmDelete(id, name) {
        if (window.confirm('Delete customer "' + name + '"?')) {
          deleteCustomer(id);
        }
      }

      function search() {
        if (!vm.searchText) {
          load();
          return;
        }
        customersService.getAll(vm.searchText)
          .then(function (data) { vm.customers = data || []; })
          .catch(function (err) { vm.errorMessage = errMsg(err, 'Search failed'); });
      }

      function openEditModal(customer) {
        vm.modalIsEdit = !!customer;
        vm.editModel = customer ? angular.copy(customer) : { full_name: '', phone: '', address: '' };
        vm.savingEdit = false;
        vm.errorMessage = '';
        vm.showEditModal = true;
      }

      function closeEditModal() {
        vm.showEditModal = false;
        vm.editModel = {};
        vm.savingEdit = false;
      }

      function saveEdit(form) {
        if (!form || form.$invalid) return;
        vm.savingEdit = true;
        vm.errorMessage = '';

        var payload = {
          full_name: vm.editModel.full_name,
          phone: vm.editModel.phone,
          address: vm.editModel.address
        };

        var promise = vm.modalIsEdit
          ? customersService.updateCustomer(vm.editModel.id, payload)
          : customersService.create(payload);

        promise
          .then(function () {
            vm.savingEdit = false;
            vm.showEditModal = false;
            vm.editModel = {};
            load();
          })
          .catch(function (err) {
            vm.savingEdit = false;
            vm.errorMessage = errMsg(err, 'Failed to save customer');
          });
      }
    }
  ]);