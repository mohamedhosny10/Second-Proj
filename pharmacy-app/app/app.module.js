
angular.module('pharmacyApp.controllers', []);
angular.module('pharmacyApp.services', []);
angular.module('pharmacyApp.guards', []);


angular.module('pharmacyApp', [
  'ngRoute',
  'pharmacyApp.controllers',
  'pharmacyApp.services',
  'pharmacyApp.guards'
]);

