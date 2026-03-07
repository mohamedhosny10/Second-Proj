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
      vm.form = { name: '', category: '', price: null, stock_quantity: null, expiry_date: null };
      vm.todayForExpiry = new Date().toISOString().split('T')[0];
      vm.expiryError = null;
      vm.submitAttempted = false;

      vm.isExpired = function (dateStr) {
        if (!dateStr) return false;
        var d = new Date(dateStr);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d < today;
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
            vm.error = (err && err.message) ? err.message : String(err || 'Failed to load medicines');
            vm.loading = false;
          });
      };

      vm.startCreate = function () {
        vm.editing = null;
        vm.form = { name: '', category: '', price: null, stock_quantity: null, expiry_date: null };
        vm.submitAttempted = false;
        vm.expiryError = null;
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
        vm.submitAttempted = false;
        vm.expiryError = null;
      };

      vm.save = function (form) {
        vm.error = null;
        vm.expiryError = null;
        vm.submitAttempted = true;
        if (form && form.$invalid) return;
        var expiry = vm.form.expiry_date || null;
        if (expiry && vm.isExpired(expiry)) {
          vm.expiryError = 'Expiry date must be in the future.';
          return;
        }
        var payload = {
          name: vm.form.name,
          category: vm.form.category || null,
          price: parseFloat(vm.form.price) || 0,
          stock_quantity: parseInt(vm.form.stock_quantity, 10) || 0,
          expiry_date: expiry
        };

        function doCreate(f) {
          vm.loading = true;
          medicinesService
            .create(payload)
            .then(function () {
              vm.loading = false;
              vm.startCreate();
              if (f) { f.$setPristine(); f.$setUntouched(); }
              vm.load();
            })
            .catch(function (err) {
              vm.error = (err && err.message) ? err.message : String(err || 'Failed to create');
              vm.loading = false;
            });
        }

        function doUpdate(f) {
          vm.loading = true;
          medicinesService
            .update(vm.editing, payload)
            .then(function () {
              vm.loading = false;
              vm.startCreate();
              if (f) { f.$setPristine(); f.$setUntouched(); }
              vm.load();
            })
            .catch(function (err) {
              vm.error = (err && err.message) ? err.message : String(err || 'Failed to update');
              vm.loading = false;
            });
        }

        medicinesService.getByName(payload.name).then(function (existing) {
          if (vm.editing) {
            if (existing && existing.id !== vm.editing) {
              vm.error = 'A medicine with this name already exists.';
              return;
            }
            doUpdate(form);
          } else {
            if (existing) {
              vm.error = 'A medicine with this name already exists.';
              return;
            }
            doCreate(form);
          }
        });
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
            vm.error = (err && err.message) ? err.message : String(err || 'Failed to delete');
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

