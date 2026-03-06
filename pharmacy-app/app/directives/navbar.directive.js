angular
  .module('pharmacyApp.directives')
  .directive('appNavbar', [
    function () {
      return {
        restrict: 'E',
        scope: {
          role: '@',
          onLogout: '&'
        },
        templateUrl: 'app/directives/navbar.template.html',
        link: function (scope) {
          scope.isAdmin = scope.role === 'admin';
          scope.isUser = scope.role === 'user';
          scope.isGuest = !scope.role || scope.role === 'guest';
        }
      };
    }
  ]);
