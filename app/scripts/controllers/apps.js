'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AppsCtrl
 * @description
 * # AppsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('AppsCtrl', function(API_ENDPOINT,$scope, $http, appService, token, userService, $uibModal, $log, sweet, teams) {
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

      $scope.ListRepos = function ListRepos(){
        /// Grab REPOS  ///
        var g = JSON.parse(localStorage.getItem('g'));
        console.log("Hello ");

        $http({
          method:"GET",
          url: "https://api.github.com/user/repos",
          headers:{
            Authorization: "token " + g.access_token,
            "Content-Type": "application/json"
          }
        }).then(function(resp){
          var repos = resp.data;
          repos.forEach(function(item){
            if(item.permissions.admin){
              $scope.repositories.push(item);
            }
          });
          console.log("Done");
        }, function err(){
          console.log("There was an error" , arguments);
        });
        /// Grab REPOS  ////
      }

       $scope.hookit = function hookit(repo){
         var g = JSON.parse(localStorage.getItem('g'));
         $http({
           method:"POST",
           url: repo['hooks_url'],
           data:
           { name: "web",
             active: true,
             events: ["push"],
             config: {
               url:API_ENDPOINT+"/payload",
               content_type: "json"
             }
           },
           headers:{
             Authorization: "token "+ g.access_token,
             "Content-Type": "application/json"
           }
         }).then(function(resp){
           console.log("Successfully hooked ", arguments);
         }, function err(){
           console.log("There was an error hooking" , arguments);
         });
         /// \SET HOOK   ////}
        }

        $scope.promote = function(app, phase) {
            sweet.show({
                title: 'Confirm',
                text: 'Promote to ' + phase + '?',
                type: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes, promote it!',
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    appService.promote({
                        ngDeployUrl: app.ngDeployUrl,
                        phase: phase
                    }).then(function() {
                        sweet.show('Promoted!', 'Application has been promoted to ' + phase, 'success');

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


console.log(team);





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
        $scope.loadApps();
        $scope.ListRepos();
    });
