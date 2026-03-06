angular
  .module('pharmacyApp.controllers')
  .controller('LoginController', [
    '$scope',
    'authService',
    function ($scope, authService) {
      var vm = this;
      vm.title = 'Login';
      vm.credentials = {
        email: '',
        password: ''
      };
      vm.loading = false;
      vm.error = null;

      $scope.$watch('vm.credentials.password', function (pwd) {
        if (!pwd) {
          vm.hasUppercase = vm.hasLowercase = vm.hasNumber = vm.hasSpecial = vm.hasMinLength = false;
          return;
        }
        vm.hasUppercase = /[A-Z]/.test(pwd);
        vm.hasLowercase = /[a-z]/.test(pwd);
        vm.hasNumber = /[0-9]/.test(pwd);
        vm.hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        vm.hasMinLength = pwd.length >= 8;
      });

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

