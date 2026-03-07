angular
  .module('pharmacyApp.controllers')
  .controller('AdminPanelController', [
    '$scope',
    'dashboardService',
    'medicinesService',
    'invoicesService',
    'usersService',
    function ($scope, dashboardService, medicinesService, invoicesService, usersService) {
      var vm = this;
      vm.title = 'Admin Panel';

      $scope.stats = null;
      $scope.statsLoading = false;
      $scope.statsError = null;

      $scope.lowStockMedicines = [];
      $scope.lowStockLoading = false;
      $scope.lowStockError = null;

      $scope.recentInvoices = [];
      $scope.invoicesLoading = false;
      $scope.invoicesError = null;

      $scope.users = [];
      $scope.usersLoading = false;
      $scope.usersError = null;

      function loadStats() {
        $scope.statsLoading = true;
        $scope.statsError = null;
        dashboardService.getOverview()
          .then(function (data) {
            $scope.stats = data;
            $scope.statsLoading = false;
          })
          .catch(function (err) {
            $scope.statsError = (err && err.message) ? err.message : 'Failed to load statistics';
            $scope.statsLoading = false;
          });
      }

      function loadLowStock() {
        $scope.lowStockLoading = true;
        $scope.lowStockError = null;
        medicinesService.getLowStock(9)
          .then(function (data) {
            $scope.lowStockMedicines = data || [];
            $scope.lowStockLoading = false;
          })
          .catch(function (err) {
            $scope.lowStockError = (err && err.message) ? err.message : 'Failed to load low stock medicines';
            $scope.lowStockLoading = false;
          });
      }

      function loadRecentInvoices() {
        $scope.invoicesLoading = true;
        $scope.invoicesError = null;
        invoicesService.getAll()
          .then(function (data) {
            $scope.recentInvoices = (data || []).slice(0, 10);
            $scope.invoicesLoading = false;
          })
          .catch(function (err) {
            $scope.invoicesError = (err && err.message) ? err.message : 'Failed to load invoices';
            $scope.invoicesLoading = false;
          });
      }

      function loadUsers() {
        $scope.usersLoading = true;
        $scope.usersError = null;
        usersService.getAll()
          .then(function (data) {
            $scope.users = data || [];
            $scope.usersLoading = false;
          })
          .catch(function (err) {
            $scope.usersError = (err && err.message) ? err.message : 'Failed to load users';
            $scope.usersLoading = false;
          });
      }

      $scope.changeUserRole = function (user) {
        var newRole = user.role === 'admin' ? 'user' : 'admin';
        $scope.usersError = null;
        usersService.updateRole(user.id, newRole)
          .then(function () {
            user.role = newRole;
            loadUsers();
          })
          .catch(function (err) {
            $scope.usersError = (err && err.message) ? err.message : 'Failed to update role. Check Supabase RLS: allow UPDATE on users for authenticated/admin.';
          });
      };

      loadStats();
      loadLowStock();
      loadRecentInvoices();
      loadUsers();
    }
  ]);
