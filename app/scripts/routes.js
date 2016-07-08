
/*

 */
angular.module('ngdeployApp')



// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
  .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'jwtInterceptorProvider', '$httpProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {


      jwtInterceptorProvider.tokenGetter = [

        function() {
          var token = localStorage.getItem('token');
          return token;
        }
      ];

      $httpProvider.interceptors.push('jwtInterceptor');



      /*
       $urlRouterProvider.rule(function($injector, $location) {
       var path = $location.url();

       // check to se/e if the path already has a slash where it should be
       if (path[path.length - 1] === '' || path.indexOf('?') > -1) {
       return;
       }

       if (path.indexOf('?') > -1) {
       return path.replace('?', '/?');
       }

       return path + '';
       });
       */


      $locationProvider.hashPrefix('!');

      $stateProvider
        .state('public', {
          url: "",
          abstract: true,
          views: {
            "navbar@": {
              templateUrl: "views/navbar/public.html",
              controller: function($rootScope, $scope, $window, $state, userService,$stateParams) {
                var query = window.location.href.split("?").slice(1).join("?");
                var redirect = query.split("=");
                if(redirect[0] == "redirectTo"){
                  var redirectToState = redirect[1];
                }

                var u = $window.User.getIdentity();
                if ($window.User.isLogged()) {
                  $state.go('private.apps')

                } else {


                }






                $scope.login = function(provider) {
                  $window.OAuth.popup(provider)
                    .done(function(result) {
                      var GitHubAccessToken = result.access_token;

                      $rootScope.$broadcast('USER::LOGIN', result);
                      $window.User.signin(result).then(function(result) {
                        var u = $window.User.getIdentity();
                        userService.getToken({
                          email: u.data.email,
                          name: u.data.name,
                          stormId: u.data.id,
                          GitHubAccessToken:GitHubAccessToken
                        }).then(function(response) {
                          localStorage.setItem('token', response);
                          if(redirectToState){
                            $state.go(redirectToState);
                          }else {
                            $state.go('private.apps');
                          }


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
              }

            },
            "layout": {
              templateUrl: "views/layout/public.html"
            }
          }

        })
        .state('public.home', {
          url: "?redirectTo",
          views: {
            "main": {
              templateUrl: "views/main.html",
              controller: "MainCtrl"
            }
          }
        })

        .state('private', {
          url: "/user",
          abstract: true,
          data: {
            bodyClasses: 'dashboard'
          },
          resolve: {
            dbUser : function($q,$window,userService){
              var deferred = $q.defer();
              if ($window.User.isLogged()) {
                userService.self().then(function(me){
                  deferred.resolve(me)

                });

              }else{
                deferred.reject();
              }
              return deferred.promise;

            },
            token: function($q, $window, userService) {
              if ($window.User.isLogged()) {


                var u = $window.User.getIdentity();

                var token = localStorage.getItem('token');
                if (!token) {
                  userService.getToken({
                    email: u.data.email,
                    name: u.data.name,
                    stormId: u.data.id
                  }).then(function(response) {

                    localStorage.setItem('token', response);
                    return $q.resolve(response)

                  })
                } else {


                  return $q.resolve(token);
                }

              } else {
                return $q.reject(false);
              }

            }
          },


          views: {
            "navbar@": {
              templateUrl: "views/navbar/private.html",
              controller: function($scope, $rootScope, $window, $state) {
                $scope.logout = function(provider) {
                  var user = $window.User.getIdentity();
                  user.logout().done(function() {
                    $rootScope.$broadcast('USER::LOGOUT');

                    $state.go('public.home');
                  });


                }
              }
            },
            "layout": {
              templateUrl: "views/layout/private.html",
              controller: ['$scope', '$state',
                function($scope, $state) {
                  console.log('private')
                  // $state.go('private.apps');

                }
              ],
            }
          }

        })

        .state('private.accounts', {
          url: "/accounts",
          views: {
            "main": {
              templateUrl: "views/private/account.html",
              controller: "AccountCtrl"
            }
          }
        })
        .state('private.apps', {
          url: "/apps",
          views: {
            "main": {
              templateUrl: "views/private/apps.html",
              controller: "AppsCtrl"
            }
          }
        })


        .state('private.domains', {
          url: "/:appId/domains",
          views: {
            "main": {
              templateUrl: "views/private/domains.html",
              controller: "DomainsCtrl"
            }
          }
        })


        .state('private.teams', {
          url: "/apps/:appId/teams",
          views: {
            "main": {
              templateUrl: "views/private/teams.html",
              controller: "TeamsCtrl"
            }
          }
        })
        .state('private.sync', {
          url: "/apps/:appId/sync",
          views: {
            "main": {
              templateUrl: "views/private/sync.html",
              controller: "SyncCtrl"
            }
          },
          resolve: {
            appObject: function ($q, $window,appService,$stateParams) {
              var deferred = $q.defer();

              appService.fetch($stateParams.appId).then(function (app) {
                deferred.resolve(app.response)

              });


              return deferred.promise;

            }
          }
        })
    }
  ]).controller('createApplicationModalCtrl', function($scope, appService) {
  $scope.createApplication = function(ngDeployUrl, name) {
    appService.post({
      ngDeployUrl: ngDeployUrl,
      name: name
    }).then(function(response) {
      console.log(response);
    })
  }

})
  .controller('domainModalCtrl', function($scope) {

  })

  // used by route security
  .constant('SECURED_ROUTES', {});
