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

      function errMsg(err, fallback) {
        return (err && err.message) ? err.message : (err || fallback);
      }

      function loadStats() {
        $scope.statsLoading = true;
        $scope.statsError = null;
        dashboardService.getOverview()
          .then(function (data) {
            $scope.stats = data;
          })
          .catch(function (err) {
            $scope.statsError = errMsg(err, 'Failed to load statistics');
          })
          .finally(function () { $scope.statsLoading = false; });
      }

      function loadLowStock() {
        $scope.lowStockLoading = true;
        $scope.lowStockError = null;
        medicinesService.getLowStock(9)
          .then(function (data) { $scope.lowStockMedicines = data || []; })
          .catch(function (err) { $scope.lowStockError = errMsg(err, 'Failed to load low stock medicines'); })
          .finally(function () { $scope.lowStockLoading = false; });
      }

      function loadRecentInvoices() {
        $scope.invoicesLoading = true;
        $scope.invoicesError = null;
        invoicesService.getAll()
          .then(function (data) { $scope.recentInvoices = (data || []).slice(0, 10); })
          .catch(function (err) { $scope.invoicesError = errMsg(err, 'Failed to load invoices'); })
          .finally(function () { $scope.invoicesLoading = false; });
      }

      function loadUsers() {
        $scope.usersLoading = true;
        $scope.usersError = null;
        usersService.getAll()
          .then(function (data) { $scope.users = data || []; })
          .catch(function (err) { $scope.usersError = errMsg(err, 'Failed to load users'); })
          .finally(function () { $scope.usersLoading = false; });
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
            $scope.usersError = errMsg(err, 'Failed to update role.');
          });
      };

      loadStats();
      loadLowStock();
      loadRecentInvoices();
      loadUsers();
    }
  ]);
