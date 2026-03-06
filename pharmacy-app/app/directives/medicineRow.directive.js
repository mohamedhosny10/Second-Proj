angular
  .module('pharmacyApp.directives')
  .directive('medicineRow', [
    '$filter',
    function ($filter) {
      var stockStatusFilter = $filter('stockStatus');
      return {
        restrict: 'A',
        scope: {
          medicine: '=',
          role: '@',
          onDelete: '&',
          onEdit: '&'
        },
        templateUrl: 'app/directives/medicine-row.template.html',
        link: function (scope) {
          scope.isAdmin = scope.role === 'admin';
          scope.isLowStock = scope.medicine && (scope.medicine.stock_quantity <= 5);
          scope.stockStatus = function () {
            return stockStatusFilter(scope.medicine ? scope.medicine.stock_quantity : 0);
          };
          scope.deleteMedicine = function () {
            if (scope.medicine && scope.medicine.id) {
              scope.onDelete({ id: scope.medicine.id });
            }
          };
          scope.editMedicine = function () {
            if (scope.medicine) {
              scope.onEdit({ medicine: scope.medicine });
            }
          };
        }
      };
    }
  ]);
