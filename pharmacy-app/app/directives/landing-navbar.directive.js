angular
  .module('pharmacyApp.directives')
  .directive('landingNavbar', [
    function () {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/directives/landing-navbar.template.html'
      };
    }
  ]);
