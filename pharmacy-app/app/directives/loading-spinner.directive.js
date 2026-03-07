angular
  .module('pharmacyApp.directives')
  .directive('loadingSpinner', [
    function () {
      return {
        restrict: 'E',
        replace: true,
        template:
          '<div class="loading-spinner-overlay">' +
            '<div class="loading-spinner-inner">' +
              '<img src="app/public/assets/logo31.png" alt="Loading..." class="loading-spinner-logo">' +
            '</div>' +
          '</div>'
      };
    }
  ]);

