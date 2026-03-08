angular.module("pharmacyApp.controllers").controller("LandingController", [
  "$location",
  "$anchorScroll",
  "$timeout",
  "authService",
  "landingService",
  function ($location, $anchorScroll, $timeout, authService, landingService) {
    var vm = this;
    vm.title = "Pharmacy Management System";
    vm.isLoggedIn = authService.isAuthenticated();

    vm.getStockStatus = function (stockQuantity) {
      if (stockQuantity === null || stockQuantity === undefined) {
        return "Unknown";
      }
      var qty = parseInt(stockQuantity, 10);
      return qty <= 10 ? "Low Stock" : "Available";
    };

    vm.searchQuery = "";
    vm.searchResults = [];
    vm.recommendations = [];
    vm.searchLoading = false;
    vm.searchError = null;

    vm.fetchSuggestions = function () {
      if (!vm.searchQuery || vm.searchQuery.length < 2) {
        vm.recommendations = [];
        return;
      }
      landingService.searchMedicines(vm.searchQuery).then(function (data) {
        vm.recommendations = (data || []).slice(0, 5);
      });
    };

    vm.selectRecommendation = function (m) {
      vm.searchQuery = m.name;
      vm.recommendations = [];
      vm.search();
    };

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
          vm.searchError =
            err && err.message ? err.message : "Search failed. Try again.";
          vm.searchResults = [];
          vm.searchLoading = false;
        });
    };

    vm.scrollTo = function (id) {
      $location.hash(id);
      $anchorScroll();
    };

    if ($location.hash()) {
      $timeout(function () {
        $anchorScroll();
      }, 100);
    }
  },
]);
