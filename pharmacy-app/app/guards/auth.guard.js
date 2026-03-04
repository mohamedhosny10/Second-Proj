angular
  .module('pharmacyApp.guards')
  .factory('authGuard', [
    'authService',
    function (authService) {
      function canAccess(next) {
        if (!next || !next.data || !next.data.roles) {
          return true;
        }

        var requiredRoles = next.data.roles;
        var userRole = authService.getCurrentUserRole();
        var isAuth = authService.isAuthenticated();

        if (!isAuth && requiredRoles.indexOf('guest') === -1) {
          return false;
        }

        if (!userRole) {
          return false;
        }

        return requiredRoles.indexOf(userRole) !== -1;
      }

      return {
        canAccess: canAccess
      };
    }
  ]);

