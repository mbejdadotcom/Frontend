'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:SyncCtrl
 * @description
 * # SyncCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
  .controller('SyncCtrl', function ($scope, sweet, git, appObject, $stateParams) {
    $scope.app = appObject;
    console.log($scope.app);
    console.log($stateParams);
    var appId = $stateParams.appId;
    $scope.repositories = [];
    $scope.link_repo = {selected: []};
    $scope.indexPath = $scope.app.indexPath;
    $scope.linkRepo = function (selected, indexPath) {
      console.log(selected, indexPath);


      git.hookIt(appId, selected, indexPath).then(function () {
        console.log(selected);
        return;
        sweet.show('Git Repo Hooked!', 'We hooked the repo successfully and the next push will be deployed automatically.', 'success');
      }, function (error) {
        sweet.show('Error', error.error, 'error');
      })
    };
    
    $scope.listRepos = function listRepos() {
      git.listRepos().then(function (repos) {
        repos.forEach(function (item) {
          if (item.permissions.admin) {
            $scope.repositories.push(item);

          }
        })
        angular.forEach($scope.repositories,function(repo,index){
          console.log($scope.app.repoName + " "+repo.name);
          if(repo.name === $scope.app.repoName){
            $scope.link_repo.selected = repo;
          }
        })
      })
    };

    $scope.listRepos();


  });
