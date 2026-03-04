angular
  .module('pharmacyApp.controllers')
  .controller('LoginController', [
    'authService',
    function (authService) {
      var vm = this;
      vm.title = 'Login';
      vm.credentials = {
        email: '',
        password: ''
      };
      vm.loading = false;
      vm.error = null;

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
            vm.error = err;
          });
      };
    }
  ]);

