angular
  .module('pharmacyApp.controllers')
  .controller('DashboardController', [
    'dashboardService',
    function (dashboardService) {
      var vm = this;
      vm.title = 'Dashboard';
      vm.overview = null;
      vm.loading = false;
      vm.error = null;

      vm.load = function () {
        vm.loading = true;
        vm.error = null;
        dashboardService.getOverview()
          .then(function (data) {
            vm.overview = data;
            vm.loading = false;
          })
          .catch(function (err) {
            vm.error = (err && err.message) ? err.message : String(err || 'Failed to load dashboard');
            vm.loading = false;
          });
      };

      vm.load();
    }
  ]);
