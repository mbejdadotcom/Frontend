'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
  .controller('AccountCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
