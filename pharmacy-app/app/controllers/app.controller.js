angular
  .module('pharmacyApp.controllers')
  .controller('AppController', [
    '$scope',
    '$rootScope',
    '$location',
    'authService',
    function ($scope, $rootScope, $location, authService) {
      var vm = this;
      vm.currentUserRole = authService.getCurrentUserRole();
      vm.showAppNavbar = true;
      vm.routeLoading = false;

      vm.logout = function () {
        authService.logout();
      };

      function refreshRole() {
        vm.currentUserRole = authService.getCurrentUserRole();
      }
      function updateNavbarVisibility() {
        var path = $location.path();
        vm.showAppNavbar = path !== '/' && path !== '';
        vm.showFullWidthLayout = path === '/admin-panel';
      }
      $rootScope.$on('$routeChangeStart', function () {
        vm.routeLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function () {
        refreshRole();
        updateNavbarVisibility();
        vm.routeLoading = false;
      });
      $rootScope.$on('$routeChangeError', function () {
        vm.routeLoading = false;
      });
      $rootScope.$on('auth:login', refreshRole);
      $rootScope.$on('auth:logout', refreshRole);
      $rootScope.$on('auth:roleUpdated', refreshRole);

      updateNavbarVisibility();
      if (authService.isAuthenticated()) {
        authService.refreshUserRole();
      }
    }
  ]);
