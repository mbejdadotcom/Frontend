'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('MainCtrl', function($rootScope, $scope, $window, userService, $state) {


        $scope.login = function(provider) {
            $window.OAuth.popup(provider)
                .done(function(oauth) {
                    $rootScope.$broadcast('USER::LOGIN', oauth);
                    $window.User.signin(oauth).then(function(result) {
                        var u = $window.User.getIdentity();
                      
                        userService.getToken({
                            email: u.data.email,
                            name: u.data.name,
                            stormId: u.data.id,
                            GitHubAccessToken:oauth.access_token
                        }).then(function(response) {
                            localStorage.setItem('token', response);
                            $state.go('private.apps');
                        })
                    });



                    //use result.access_token in your API request
                    //or use result.get|post|put|del|patch|me methods (see below)
                })
                .fail(function(err) {
                    console.log(err)
                        //handle error with err
                });

        }
    });
