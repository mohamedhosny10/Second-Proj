angular
  .module('pharmacyApp.controllers')
  .controller('LoginController', [
    '$location',
    'authService',
    function ($location, authService) {
      var vm = this;
      vm.title = 'Login';
      vm.signedUpMessage = $location.search().signedup === '1';
      if (vm.signedUpMessage) $location.search('signedup', null);
      vm.credentials = {
        email: '',
        password: ''
      };
      vm.loading = false;
      vm.error = null;
      vm.showPassword = false;

      vm.submit = function () {
        vm.error = null;
        vm.loading = true;

        authService
          .login(vm.credentials)
          .then(function () {
            vm.loading = false;
          })
          .catch(function (err) {
            vm.loading = false;
            vm.error = (err && err.message) ? err.message : String(err || 'Login failed');
          });
      };
    }
  ]);
