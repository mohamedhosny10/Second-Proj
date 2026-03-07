angular.module("pharmacyApp.controllers", []);
angular.module("pharmacyApp.services", []);
angular.module("pharmacyApp.directives", []);

angular.module("pharmacyApp", [
  "ngRoute",
  "pharmacyApp.controllers",
  "pharmacyApp.services",
  "pharmacyApp.directives",
]);
