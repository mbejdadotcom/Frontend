'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AppsCtrl
 * @description
 * # AppsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
  .controller('AppsCtrl', function ($rootScope,$scope,$interval,$filter, appService, stripe, token, userService, $uibModal, $log, sweet, teams,dbUser,git,$stateParams) {

    $scope.selectedPlan = null;
    $scope.currentPremium = 0;

    $scope.plans = [
      {name:'Free', pId:'free', id:0, count:0, amt:0},
      {name:'Developer', id:1, pId:'developer', count:1, amt:5},
      {name:'Team', id:2 , pId:'team' ,count:5, amt:25},
      {name:'Business', id:3,pId:'business', count: 30, amt:150}];

    $scope.status= [];

    if($stateParams.redirectTo){
      $state.go($stateParams.redirectTo);
    }

    $scope.user = dbUser;


    $scope.token = token;
    $scope.loadApps = function () {
      appService.get().then(function (response) {
        console.log(response);
        var countPremium = 0;
        angular.forEach(response, function(app){
          if(app.apps.zoneId != null && app.teams.type == "owner") ++countPremium;
        });
        $scope.apps = response;
        $scope.currentPremium = countPremium;
      });
    };

    $scope.getSubscription = function (){

        userService.subscription.get($scope.user.customerId).then(function(response){
          if( $scope.plans[response] ){
            $scope.selectedPlan = $scope.plans[response];
          }else{
            $scope.selectedPlan = $scope.plans[0];
          }
        },function(error){
          console.log("Error retrieving subscriptions. ", error);
        })
    }



    $scope.createApplication = function (ngDeployUrl, name) {
      appService.post({
        ngDeployUrl: ngDeployUrl,
        name: name
      }).then(function (response) {


        sweet.show('Created!', 'The application has been created.', 'success');

        $scope.loadApps();
      }, function (error) {
        sweet.show('Oh no!', error, 'error');
      })
    };

    $scope.purgeCache = function (app, stage) {
      appService.purge({
        id: app.id,
        ngDeployUrl:app.ngDeployUrl
      }).then(function () {
        sweet.show('Cache Purged!', 'Application cache has been purged', 'success');

      }, function (error) {
        sweet.show('Error', error, 'error');

      });


    };
    $scope.cli = function (name) {
      return 'ngdeploy init '+name+' .';
    }



    $scope.promote = function (app, stage) {
      sweet.show({
        title: 'Confirm',
        text: 'Promote to ' + stage + '?',
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, promote it!',
        closeOnConfirm: false,
        closeOnCancel: false
      }, function (isConfirm) {
        if (isConfirm) {
          appService.promote({
            id: app.id,
            stage: stage
          }).then(function () {
            sweet.show('Promoted!', 'Application has been promoted to ' + stage, 'success');

          })

        } else {
          sweet.show('Cancelled', 'Nothing changed', 'error');
        }
      });
    };

    $scope.delete = function (appId, team, apps) {
      if (team.type == "owner") {

        sweet.show({
          title: 'Confirm',
          text: 'Delete this application?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          closeOnConfirm: false,
          closeOnCancel: false
        }, function (isConfirm) {
          if (isConfirm) {
            appService.delete(appId).then(function (response) {
              sweet.show('Deleted!', 'The application has been deleted.', 'success');
              $scope.loadApps();
            }, function (error) {
              sweet.show('Error', 'Error has occured '+error, 'error');

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
        }, function (isConfirm) {
          if (isConfirm) {

            teams.delete({
              appId: team.appId,
              userId: team.userId
            }).then(function (results) {
              sweet.show('Remove!', 'You have been removed as a collaborator', 'success');


            });

          } else {
            sweet.show('Cancelled', 'Nothing changed', 'error');
          }
        });


      }


    };
    $scope.setupHosting = function (app) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'setupHosting.html',
        controller: 'setupHostingCtrl',
        size: 'lg',
        resolve: {
          app: function () {
            return app
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.upgrade = function (app) {

      sweet.show({
        title: 'Confirm',
        text: 'Upgrade to production hosting?',
        showCancelButton: true,
        confirmButtonText: 'Yes, upgrade it!',
        closeOnConfirm: true,
        closeOnCancel: true
      }, function (isConfirm) {
        if (isConfirm) {
          appService.upgrade(app.id).then(function (response) {
            sweet.show('Upgraded!', 'Application has been upgraded.', 'success');
            $scope.loadApps();
          }, function (error) {
            sweet.show('Upgrade Failed !', error, 'error');

          });

        } else {
          sweet.show('Cancelled', 'Nothing changed', 'error');
        }
      });


    };

    $scope.getLogs = function(appId){
      appService.getLogs(appId).then(function(response){
        console.log(response);

      })
    };

    $scope.loadApps();
    $scope.getSubscription();
  })
