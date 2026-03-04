angular
  .module('pharmacyApp.controllers')
  .controller('NotFoundController', [
    function () {
      var vm = this;
      vm.title = 'Page Not Found';
    }
  ]);

