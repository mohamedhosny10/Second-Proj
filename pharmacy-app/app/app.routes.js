angular
  .module("pharmacyApp")
  .config([
    "$routeProvider",
    "$locationProvider",
    function ($routeProvider, $locationProvider) {
      $locationProvider.hashPrefix("!");

      $routeProvider
        .when("/", {
          templateUrl: "app/views/landing.html",
          controller: "LandingController",
          controllerAs: "vm",
          data: {
            roles: ["guest", "user", "admin"],
          },
        })
        .when("/login", {
          templateUrl: "app/views/login.html",
          controller: "LoginController",
          controllerAs: "vm",
          data: {
            roles: ["guest", "user", "admin"],
          },
        })
        .when("/signup", {
          templateUrl: "app/views/signup.html",
          controller: "SignupController",
          controllerAs: "vm",
          data: {
            roles: ["guest", "user", "admin"],
          },
        })
        .when("/dashboard", {
          templateUrl: "app/views/dashboard.html",
          controller: "DashboardController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/medicines", {
          templateUrl: "app/views/medicines.html",
          controller: "MedicinesController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/customers", {
          templateUrl: "app/views/customers.html",
          controller: "CustomersController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/customers/:id/history", {
          templateUrl: "app/views/customers-history.html",
          controller: "CustomersController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/create-invoice", {
          templateUrl: "app/views/create-invoice.html",
          controller: "CreateInvoiceController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/invoice-details/:id", {
          templateUrl: "app/views/invoice-details.html",
          controller: "InvoiceDetailsController",
          controllerAs: "vm",
          data: {
            roles: ["user", "staff", "admin"],
          },
        })
        .when("/admin-panel", {
          templateUrl: "app/views/admin-panel.html",
          controller: "AdminPanelController",
          controllerAs: "vm",
          data: {
            roles: ["admin"],
          },
        })
        .otherwise({
          redirectTo: "/",
        });
    },
  ])
  .run([
    "$rootScope",
    "$location",
    "authService",
    function ($rootScope, $location, authService) {
      $rootScope.$on("$routeChangeStart", function (event, next) {
        if (!next) {
          return;
        }

        // --- Inlined Auth Guard Logic ---
        var allowed = true;
        if (next.data && next.data.roles) {
          var requiredRoles = next.data.roles;
          var userRole = authService.getCurrentUserRole();
          var isAuth = authService.isAuthenticated();

          if (!isAuth && requiredRoles.indexOf("guest") === -1) {
            allowed = false;
          } else if (userRole) {
            allowed = requiredRoles.indexOf(userRole) !== -1;
          } else {
            allowed = false;
          }
        }
        // --------------------------------

        if (!allowed) {
          event.preventDefault();
          $location.path("/login");
        }
      });
    },
  ]);
