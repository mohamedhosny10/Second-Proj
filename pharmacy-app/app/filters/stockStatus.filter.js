angular
  .module('pharmacyApp.filters')
  .filter('stockStatus', [
    function () {
      return function (stockQuantity) {
        if (stockQuantity === null || stockQuantity === undefined) {
          return 'Unknown';
        }
        var qty = parseInt(stockQuantity, 10);
        return qty <= 5 ? 'Low Stock' : 'Available';
      };
    }
  ]);
