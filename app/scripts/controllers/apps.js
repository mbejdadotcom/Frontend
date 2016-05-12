'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AppsCtrl
 * @description
 * # AppsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('AppsCtrl', function(API_ENDPOINT,$scope, $http, appService, token, userService, $uibModal, $log, sweet, teams, git) {
        $scope.token = token;
        $scope.loadApps = function() {
            appService.get().then(function(response) {
                $scope.apps = response;
            });
        }

        $scope.createApplication = function(ngDeployUrl, name) {
            appService.post({
                ngDeployUrl: ngDeployUrl,
                name: name
            }).then(function(response) {
                sweet.show('Created!', 'The application has been created.', 'success');
                hookit($scope.link_repo);
                $scope.loadApps();
                console.log(response);
            })
        }

      $scope.repositories = []
      $scope.link_repo = -1;

        $scope.purgeCache = function(app, stage) {
            console.log(app)
            appService.purge({
                ngDeployUrl: app.ngDeployUrl,
            }).then(function() {
                sweet.show('Cache Purged!', 'Application cache has been purged', 'success');

            }, function(error) {
                sweet.show('Error', error.error, 'error');

            })


        }
        $scope.promote = function(app, stage) {
            sweet.show({
                title: 'Confirm',
                text: 'Promote to ' + stage + '?',
                type: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes, promote it!',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    appService.promote({
                        ngDeployUrl: app.ngDeployUrl,
                        stage: stage
                    }).then(function() {
                        sweet.show('Promoted!', 'Application has been promoted to ' + stage, 'success');

                    })

                } else {
                    sweet.show('Cancelled', 'Nothing changed', 'error');
                }
            });
        }

        $scope.delete = function(ngDeployUrl, team, apps) {
            if (team.type == "owner") {

                sweet.show({
                    title: 'Confirm',
                    text: 'Delete this application?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {
                        appService.delete(ngDeployUrl).then(function(response) {
                            sweet.show('Deleted!', 'The application has been deleted.', 'success');
                            $scope.loadApps();
                        }, function(error) {

                            console.log(error)
                        });

                    } else {
                        sweet.show('Cancelled', 'Nothing changed', 'error');
                    }
                });
            }






            if (team.type == "user") {


                sweet.show({
                    title: 'Confirm',
                    text: 'Remove yourself as collaborator',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, remove me!',
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function(isConfirm) {
                    if (isConfirm) {

                        teams.delete({
                            appId: team.appId,
                            userId: team.userId
                        }).then(function(results) {
                            sweet.show('Remove!', 'You have been removed as a collaborator', 'success');


                        });

                    } else {
                        sweet.show('Cancelled', 'Nothing changed', 'error');
                    }
                });


            }


        }
        $scope.setupHosting = function(app) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'setupHosting.html',
                controller: 'setupHostingCtrl',
                size: 'lg',
                resolve: {
                    app: function() {
                        return app
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.upgrade = function(app) {

            sweet.show({
                title: 'Confirm',
                text: 'Upgrade to production hosting?',
                showCancelButton: true,
                confirmButtonText: 'Yes, upgrade it!',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    appService.upgrade(app.ngDeployUrl).then(function(response) {
                        sweet.show('Deleted!', 'The application has been deleted.', 'success');
                        $scope.loadApps();
                    }, function(error) {

                        console.log(error)
                    });

                } else {
                    sweet.show('Cancelled', 'Your imaginary file is safe :)', 'error');
                }
            });
        }

      $scope.listRepos= function listRepos(){
        git.listRepos().then(function(){
          forEach(function(item){
            if(item.permissions.admin){
              $scope.repositories.push(item);
            }})
        })
      }

      $scope.hookIt= function hookIt(){
        git.hookit().then(function() {
          sweet.show('Git Repo Hooked!', 'We hooked the repo sucesfuly and the next push will be deployed automatically.', 'success');

        }, function(error) {
          sweet.show('Error', error.error, 'error');

        })
      }

      $scope.loadApps();
      $scope.listRepos();
    });
