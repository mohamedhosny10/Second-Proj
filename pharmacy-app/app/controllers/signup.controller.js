angular
  .module('pharmacyApp.controllers')
  .controller('SignupController', [
    '$scope',
    '$location',
    'authService',
    function ($scope, $location, authService) {
      var vm = this;
      vm.title = 'Sign up';
      vm.form = {
        full_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
      vm.loading = false;
      vm.error = null;
      vm.showPassword = false;

      vm.hasUppercase = false;
      vm.hasLowercase = false;
      vm.hasNumber = false;
      vm.hasSpecial = false;
      vm.hasMinLength = false;

      $scope.$watch('vm.form.password', function (pwd) {
        if (!pwd) {
          vm.hasUppercase = vm.hasLowercase = vm.hasNumber = vm.hasSpecial = vm.hasMinLength = false;
          return;
        }
        vm.hasUppercase = /[A-Z]/.test(pwd);
        vm.hasLowercase = /[a-z]/.test(pwd);
        vm.hasNumber = /[0-9]/.test(pwd);
        vm.hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/'`~]/.test(pwd);
        vm.hasMinLength = pwd.length >= 8;
      });

      vm.passwordsMatch = function () {
        return vm.form.password && vm.form.confirmPassword && vm.form.password === vm.form.confirmPassword;
      };

      vm.submit = function () {
        vm.error = null;
        if (!vm.passwordsMatch()) {
          vm.error = 'Passwords do not match.';
          return;
        }
        vm.loading = true;

        authService
          .signUp({
            full_name: vm.form.full_name,
            email: vm.form.email,
            password: vm.form.password
          })
          .then(function () {
            vm.loading = false;
            $location.path('/login').search('signedup', '1');
          })
          .catch(function (err) {
            vm.loading = false;
            vm.error = (err && err.message) ? err.message : String(err || 'Sign up failed');
          });
      };
    }
  ]);
