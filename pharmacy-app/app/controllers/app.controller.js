angular
  .module('pharmacyApp.controllers')
  .controller('AppController', [
    '$scope',
    '$rootScope',
    'authService',
    function ($scope, $rootScope, authService) {
      var vm = this;
      vm.currentUserRole = authService.getCurrentUserRole();

      vm.logout = function () {
        authService.logout();
      };

      function refreshRole() {
        vm.currentUserRole = authService.getCurrentUserRole();
      }
      $rootScope.$on('$routeChangeSuccess', refreshRole);
      $rootScope.$on('auth:login', refreshRole);
      $rootScope.$on('auth:logout', refreshRole);
    }
  ]);
