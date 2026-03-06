angular
  .module('pharmacyApp')
  .config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider
        .when('/login', {
          templateUrl: 'app/views/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          data: {
            roles: ['guest', 'user', 'admin']
          }
        })
        .when('/dashboard', {
          templateUrl: 'app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm',
          data: {
            roles: ['user', 'admin']
          }
        })
        .when('/medicines', {
          templateUrl: 'app/views/medicines.html',
          controller: 'MedicinesController',
          controllerAs: 'vm',
          data: {
            roles: ['user', 'admin']
          }
        })
        .when('/customers', {
          templateUrl: 'app/views/customers.html',
          controller: 'CustomersController',
          controllerAs: 'vm',
          data: {
            roles: ['user', 'admin']
          }
        })

        .when('/customers/new', {
         templateUrl: 'app/views/customers-form.html',
         controller: 'CustomersController',
         controllerAs: 'vm',
        data: { roles: ['user', 'admin'] }
       })
      .when('/customers/edit/:id', {
        templateUrl: 'app/views/customers-form.html',
         controller: 'CustomersController',
        controllerAs: 'vm',
        data: { roles: ['user', 'admin'] }
    })

     .when('/customers/:id/history', {
       templateUrl: 'app/views/customers-history.html',
      controller: 'CustomersController',
      controllerAs: 'vm',
      data: { roles: ['user', 'admin'] }
    })

        .when('/create-invoice', {
          templateUrl: 'app/views/create-invoice.html',
          controller: 'CreateInvoiceController',
          controllerAs: 'vm',
          data: {
            roles: ['user', 'admin']
          }
        })
        .when('/invoice-details', {
          templateUrl: 'app/views/invoice-details.html',
          controller: 'InvoiceDetailsController',
          controllerAs: 'vm',
          data: {
            roles: ['user', 'admin']
          }
        })
        .when('/admin-panel', {
          templateUrl: 'app/views/admin-panel.html',
          controller: 'AdminPanelController',
          controllerAs: 'vm',
          data: {
            roles: ['admin']
          }
        })
        .when('/404', {
          templateUrl: 'app/views/404.html',
          controller: 'NotFoundController',
          controllerAs: 'vm',
          data: {
            roles: ['guest', 'user', 'admin']
          }
        })
        .otherwise({
          redirectTo: '/404'
        });
    }
  ])
  .run([
    '$rootScope',
    '$location',
    'authGuard',
    function ($rootScope, $location, authGuard) {
      $rootScope.$on('$routeChangeStart', function (event, next) {
        if (!next) {
          return;
        }

        var allowed = authGuard.canAccess(next);
        if (!allowed) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    }
  ]);

