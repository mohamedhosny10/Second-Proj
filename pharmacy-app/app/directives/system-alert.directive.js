angular
  .module('pharmacyApp.directives')
  .directive('systemAlert', [
    function () {
      return {
        restrict: 'E',
        scope: {
          message: '@',
          type: '@'
        },
        templateUrl: 'app/directives/system-alert.template.html',
        link: function (scope) {
          scope.alertClass = scope.type === 'error' ? 'alert-danger' : 'alert-info';
        }
      };
    }
  ]);
