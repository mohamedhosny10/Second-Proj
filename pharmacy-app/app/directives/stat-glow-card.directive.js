angular
  .module('pharmacyApp.directives')
  .directive('statGlowCard', [
    function () {
      return {
        restrict: 'E',
        scope: {
          title: '@',
          value: '='
        },
        templateUrl: 'app/directives/stat-glow-card.template.html'
      };
    }
  ]);
