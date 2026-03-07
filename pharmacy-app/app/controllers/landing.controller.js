angular
  .module('pharmacyApp.controllers')
  .controller('LandingController', [
    '$location',
    '$anchorScroll',
    '$timeout',
    'authService',
    'landingService',
    function ($location, $anchorScroll, $timeout, authService, landingService) {
      var vm = this;
      vm.title = 'Pharmacy Management System';
      vm.isLoggedIn = authService.isAuthenticated();

      vm.searchQuery = '';
      vm.searchResults = [];
      vm.searchLoading = false;
      vm.searchError = null;

      vm.search = function () {
        vm.searchError = null;
        vm.searchLoading = true;
        landingService
          .searchMedicines(vm.searchQuery)
          .then(function (data) {
            vm.searchResults = data || [];
            vm.searchLoading = false;
          })
          .catch(function (err) {
            vm.searchError = (err && err.message) ? err.message : 'Search failed. Try again.';
            vm.searchResults = [];
            vm.searchLoading = false;
          });
      };

      vm.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
      };

      if ($location.hash()) {
        $timeout(function () { $anchorScroll(); }, 100);
      }
    }
  ]);
