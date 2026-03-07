angular
  .module('pharmacyApp.controllers')
  .controller('DashboardController', [
    'dashboardService',
    function (dashboardService) {
      var vm = this;
      vm.title = 'Analytics Dashboard';
      vm.overview = null;
      vm.analytics = null;
      vm.revenueTrend = null;
      vm.inventoryStatus = null;
      vm.recentTransactions = [];
      vm.loading = false;
      vm.chartsLoading = false;
      vm.error = null;

      vm.load = function () {
        vm.loading = true;
        vm.error = null;

        dashboardService.getOverview()
          .then(function (data) {
            vm.overview = data;
          })
          .catch(function (err) {
            vm.error = (err && err.message) ? err.message : String(err || 'Failed to load dashboard');
          })
          .finally(function () {
            vm.loading = false;
          });

        dashboardService.getAnalytics()
          .then(function (data) {
            vm.analytics = data;
            vm.totalSalesFormatted = data ? vm.formatCurrency(data.totalSales) : '—';
            vm.monthlyRevenueFormatted = data ? vm.formatCurrency(data.monthlyRevenue) : '—';
          })
          .catch(function (err) {
            if (!vm.error) vm.error = (err && err.message) ? err.message : 'Failed to load analytics';
          });

        vm.chartsLoading = true;
        dashboardService.getRevenueTrend(12)
          .then(function (data) {
            vm.revenueTrend = data;
            vm.chartsLoading = false;
          })
          .catch(function () {
            vm.revenueTrend = { labels: [], data: [] };
            vm.chartsLoading = false;
          });

        dashboardService.getInventoryStatus()
          .then(function (data) {
            vm.inventoryStatus = data;
          })
          .catch(function () {
            vm.inventoryStatus = { available: 0, lowStock: 0, expired: 0 };
          });

        dashboardService.getRecentTransactions(10)
          .then(function (data) {
            vm.recentTransactions = data || [];
          })
          .catch(function () {
            vm.recentTransactions = [];
          });
      };

      vm.formatCurrency = function (num) {
        return num !== undefined && num !== null ? Number(num).toLocaleString('en-US', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—';
      };

      vm.load();
    }
  ]);
