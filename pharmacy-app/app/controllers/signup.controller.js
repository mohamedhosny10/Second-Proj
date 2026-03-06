angular
  .module('pharmacyApp.controllers')
  .controller('SignupController', [
    '$location',
    'authService',
    function ($location, authService) {
      var vm = this;
      vm.title = 'Sign up';
      vm.form = {
        full_name: '',
        email: '',
        password: ''
      };
      vm.loading = false;
      vm.error = null;

      vm.submit = function () {
        vm.error = null;
        vm.success = null;
        vm.loading = true;

        authService
          .signUp(vm.form)
          .then(function () {
            vm.loading = false;
            $location.path('/login').search('signedup', '1');
          })
          .catch(function (err) {
            vm.loading = false;
            vm.error = err;
          });
      };
    }
  ]);
