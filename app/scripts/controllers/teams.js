'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:TeamsCtrl
 * @description
 * # TeamsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('TeamsCtrl', function($scope, $stateParams, teams, appService, sweet) {
        $scope.team = [];
        $scope.appId = $stateParams.appId;
        $scope.app = {};
        appService.fetch($scope.appId).then(function(results) {
            $scope.app = results.response;

        }, function(error) {

        })
        teams.get($scope.appId).then(function(results) {
            $scope.items = results.response;
        }, function(error) {

        })
        $scope.remove = function(userId) {
            teams.delete({
                appId: $scope.appId,
                userId: userId
            }).then(function(results) {
                console.log(results);
            });
        }
        $scope.add = function(email) {
            sweet.show({
                title: 'Confirm',
                text: 'Add ' + email + ' as collaborator?',
                type: 'success',
                showCancelButton: true,
                confirmButtonText: 'Add',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    teams.post({
                        email: email,
                        appId: $scope.appId
                    }).then(function(results) {
                        console.log(results);
                        sweet.show('Added !', 'Collaborator ' + email + ' has been added', 'success');

                    });
                } else {
                    sweet.show('Cancelled', 'Nothing changed', 'error');
                }
            });




        }
        var self = this;

    });
