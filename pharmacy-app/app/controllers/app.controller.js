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

      $rootScope.$on('$routeChangeSuccess', function () {
        vm.currentUserRole = authService.getCurrentUserRole();
      });
    }
  ]);
