angular
  .module('pharmacyApp.directives')
  .directive('revenueLineChart', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labels: '=',
          values: '='
        },
        template: '<div class="pharmacy-chart-container position-relative" style="height: 280px;"><canvas></canvas></div>',
        link: function (scope, element, attrs) {
          var canvas = element.find('canvas')[0];
          var chart = null;

          function buildChart() {
            if (!canvas || !scope.labels || !scope.values || !window.Chart) return;
            if (chart) chart.destroy();

            var ctx = canvas.getContext('2d');
            var gradient = ctx.createLinearGradient(0, 0, 0, 280);
            gradient.addColorStop(0, 'rgba(15, 150, 156, 0.8)');
            gradient.addColorStop(1, 'rgba(12, 112, 117, 0.2)');

            chart = new window.Chart(canvas, {
              type: 'line',
              data: {
                labels: scope.labels,
                datasets: [{
                  label: 'Revenue',
                  data: scope.values,
                  borderColor: '#0F969C',
                  backgroundColor: gradient,
                  fill: true,
                  tension: 0.4
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    grid: { color: 'rgba(12, 112, 117, 0.2)' },
                    ticks: { color: '#6DA5C0', maxTicksLimit: 8 }
                  },
                  y: {
                    grid: { color: 'rgba(12, 112, 117, 0.2)' },
                    ticks: { color: '#6DA5C0' }
                  }
                }
              }
            });
          }

          scope.$watchCollection(function () {
            return [scope.labels, scope.values];
          }, function () {
            buildChart();
          });
        }
      };
    }
  ]);
