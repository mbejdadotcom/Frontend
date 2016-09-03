angular.module('ngdeployApp')
  .controller('LogsCtrl', function ($scope, logs, appObject, $state) {
    $scope.app = appObject;
    $scope.logs = logs;
    $scope.refresh = function () {
      $state.reload();

    };
    $scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    $scope.$watch('day', function (day) {
      if (day) {
        $state.go('private.logs', {day: day});
      }

    })

  });
