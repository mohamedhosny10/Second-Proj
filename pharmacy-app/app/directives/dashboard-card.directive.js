angular
  .module('pharmacyApp.directives')
  .directive('dashboardCard', [
    function () {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '='
        },
        templateUrl: 'app/directives/dashboard-card.template.html'
      };
    }
  ]);
