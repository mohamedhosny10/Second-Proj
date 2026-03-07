angular
  .module('pharmacyApp.directives')
  .directive('inventoryDoughnutChart', [
    function () {
      return {
        restrict: 'E',
        scope: {
          available: '=',
          lowStock: '=',
          expired: '='
        },
        template: '<div class="pharmacy-chart-container position-relative" style="height: 280px;"><canvas></canvas></div>',
        link: function (scope, element, attrs) {
          var canvas = element.find('canvas')[0];
          var chart = null;

          function buildChart() {
            if (!canvas || !window.Chart) return;
            if (chart) chart.destroy();

            var a = parseInt(scope.available, 10) || 0;
            var l = parseInt(scope.lowStock, 10) || 0;
            var e = parseInt(scope.expired, 10) || 0;

            chart = new window.Chart(canvas, {
              type: 'doughnut',
              data: {
                labels: ['Available', 'Low Stock', 'Expired'],
                datasets: [{
                  data: [a, l, e],
                  backgroundColor: ['#0F969C', '#c7a84e', '#c75c5c'],
                  borderWidth: 0
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#6DA5C0' }
                  }
                }
              }
            });
          }

          scope.$watchGroup(['available', 'lowStock', 'expired'], function () {
            buildChart();
          });
        }
      };
    }
  ]);
