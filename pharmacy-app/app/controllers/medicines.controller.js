angular
  .module('pharmacyApp.controllers')
  .controller('MedicinesController', [
    'medicinesService',
    'authService',
    function (medicinesService, authService) {
      var vm = this;
      vm.title = 'Medicines';
      vm.items = [];
      vm.search = '';
      vm.loading = false;
      vm.error = null;
      vm.currentRole = authService.getCurrentUserRole();
      vm.isAdmin = vm.currentRole === 'admin';

      vm.editing = null;
      vm.form = {
        name: '',
        category: '',
        price: null,
        stock_quantity: null,
        expiry_date: null
      };

      vm.load = function () {
        vm.loading = true;
        vm.error = null;
        medicinesService
          .getAll(vm.search)
          .then(function (data) {
            vm.items = data || [];
            vm.loading = false;
          })
          .catch(function (err) {
            vm.error = err;
            vm.loading = false;
          });
      };

      vm.startCreate = function () {
        vm.editing = null;
        vm.form = {
          name: '',
          category: '',
          price: null,
          stock_quantity: null,
          expiry_date: null
        };
      };

      vm.startEdit = function (item) {
        vm.editing = item.id;
        vm.form = {
          name: item.name,
          category: item.category,
          price: item.price,
          stock_quantity: item.stock_quantity,
          expiry_date: item.expiry_date
        };
      };

      vm.save = function () {
        vm.error = null;
        vm.loading = true;

        var payload = angular.copy(vm.form);

        if (vm.editing) {
          medicinesService
            .update(vm.editing, payload)
            .then(function () {
              vm.loading = false;
              vm.startCreate();
              vm.load();
            })
            .catch(function (err) {
              vm.error = err;
              vm.loading = false;
            });
        } else {
          medicinesService
            .create(payload)
            .then(function () {
              vm.loading = false;
              vm.startCreate();
              vm.load();
            })
            .catch(function (err) {
              vm.error = err;
              vm.loading = false;
            });
        }
      };

      vm.remove = function (item) {
        if (!vm.isAdmin) {
          vm.error = 'Only admin can delete medicines';
          return;
        }
        vm.loading = true;
        vm.error = null;

        medicinesService
          .remove(item.id)
          .then(function () {
            vm.loading = false;
            vm.load();
          })
          .catch(function (err) {
            vm.error = err;
            vm.loading = false;
          });
      };

      vm.deleteMedicine = function (id) {
        var item = vm.items.find(function (m) { return m.id === id; });
        if (item) vm.remove(item);
      };

      vm.onSearchChange = function () {
        vm.load();
      };

      vm.startCreate();
      vm.load();
    }
  ]);

