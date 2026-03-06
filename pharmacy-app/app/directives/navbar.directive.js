angular
  .module('pharmacyApp.directives')
  .directive('appNavbar', [
    function () {
      return {
        restrict: 'E',
        scope: {
          role: '=',
          onLogout: '&'
        },
        templateUrl: 'app/directives/navbar.template.html',
        link: function (scope) {
          function updateRoleFlags() {
            var r = scope.role;
            scope.isAdmin = r === 'admin';
            scope.isUser = r === 'user';
            scope.isGuest = !r || r === 'guest';
          }
          scope.$watch('role', updateRoleFlags);
          updateRoleFlags();
        }
      };
    }
  ]);
