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
          function getRoleLabel(r) {
            if (!r || r === 'guest') return 'Guest';
            if (r === 'admin') return 'Admin';
            if (r === 'staff') return 'Staff';
            return 'User';
          }

          function updateRoleFlags() {
            var r = scope.role;
            scope.isAdmin = r === 'admin';
            scope.isUser = r === 'user' || r === 'staff';
            scope.isGuest = !r || r === 'guest';
            scope.roleLabel = getRoleLabel(r);
          }

          scope.$watch('role', updateRoleFlags);
          updateRoleFlags();
        }
      };
    }
  ]);
