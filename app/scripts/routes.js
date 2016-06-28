
/*
 Text Auto Response
 i-0f51ea4a
 m3.medium
 us-east-1d
 running
 2/2 checks passed
 None
 ec2-54-89-144-179.compute-1.amazonaws.com
 54.89.144.179
 LPTV2GEN
 disabled
 June 22, 2016 at 2:07:55 PM UTC-4
 Open
 Homepage
 i-e4505579
 t2.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-90-7-54.compute-1.amazonaws.com
 52.90.7.54
 LPTV2GEN
 disabled
 May 16, 2016 at 11:53:38 AM UTC-4
 Open
 AdminFrontend
 i-c8c77055
 t2.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-207-233-5.compute-1.amazonaws.com
 52.207.233.5
 LPTV2GEN
 disabled
 April 20, 2016 at 4:11:52 PM UTC-4
 Open
 FusionPRO Server
 i-14e40389
 m4.large
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-91-235-67.compute-1.amazonaws.com
 52.91.235.67
 LPTV2GEN
 disabled
 April 6, 2016 at 8:23:23 PM UTC-4
 launch-wizard-6
 AutoResponse
 i-f4213d6e
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-207-236-193.compute-1.amazonaws.com
 52.207.236.193
 LPTV2GEN
 disabled
 April 5, 2016 at 12:59:48 PM UTC-4
 Open
 AutoResponse
 i-fd213d67
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-91-15-18.compute-1.amazonaws.com
 52.91.15.18
 LPTV2GEN
 disabled
 April 5, 2016 at 12:59:48 PM UTC-4
 Open
 AdminBackend
 i-4e3c2ad4
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-87-176-240.compute-1.amazonaws.com
 52.87.176.240
 LPTV2GEN
 disabled
 April 4, 2016 at 3:01:37 PM UTC-4
 Open
 printAdmin Production
 i-39f7c4ba
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-23-167-34.compute-1.amazonaws.com
 52.23.167.34
 LPTV2GEN
 disabled
 March 28, 2016 at 11:11:52 AM UTC-4
 launch-wizard-5
 AutoResponse WINDOWS
 i-61c6e0e2
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-54-85-21-230.compute-1.amazonaws.com
 54.85.21.230
 LPTV2GEN
 disabled
 March 24, 2016 at 4:00:45 PM UTC-4
 Website Windows Production
 Backend
 i-c06a4d43
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-54-172-123-133.compute-1.amazonaws.com
 54.172.123.133
 LPTV2GEN
 disabled
 March 24, 2016 at 10:30:22 AM UTC-4
 Open
 Backend
 i-c26a4d41
 m3.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-54-172-18-222.compute-1.amazonaws.com
 54.172.18.222
 LPTV2GEN
 disabled
 March 24, 2016 at 10:30:22 AM UTC-4
 Open
 RP TESTING LAUNCH
 i-e3c89067
 m3.xlarge
 us-east-1d
 running
 2/2 checks passed
 None
 ec2-54-85-194-60.compute-1.amazonaws.com
 54.85.194.60
 LPTV2GEN
 disabled
 March 22, 2016 at 5:30:00 PM UTC-4
 launch-wizard-4
 UbuntuCFTemplate
 i-3a8a3ba1
 m3.large
 us-east-1a
 running
 2/2 checks passed
 None
 ec2-54-209-36-186.compute-1.amazonaws.com
 54.209.36.186
 LPTV2GEN
 disabled
 March 21, 2016 at 8:59:03 PM UTC-4
 ColdFusion 11-ColdFusion 11-AutogenByAWSMP-
 RP-Win-Test-2
 i-01e6b282
 m3.large
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-91-27-30.compute-1.amazonaws.com
 52.91.27.30
 LPTV2GEN
 disabled
 March 21, 2016 at 8:52:54 PM UTC-4
 launch-wizard-3
 Frontend
 i-3e3763bd
 t2.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-54-210-117-138.compute-1.amazonaws.com
 54.210.117.138
 LPTV2GEN
 enabled
 March 21, 2016 at 5:48:58 PM UTC-4
 Open
 Frontend
 i-3f3763bc
 t2.medium
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-54-210-144-216.compute-1.amazonaws.com
 54.210.144.216
 LPTV2GEN
 enabled
 March 21, 2016 at 5:48:58 PM UTC-4
 Open
 SQL SERVER A
 i-f3cb2370
 m4.large
 us-east-1c
 running
 2/2 checks passed
 None
 ec2-52-87-159-87.compute-1.amazonaws.com
 52.87.159.87
 RPV2
 disabled
 February 26, 2016 at 7:53:28 PM UTC-5
 launch-wizard-1
 COLDFUSION A

 
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
              controller: function($rootScope, $scope, $window, $state, userService) {
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
                        console.log("RESULT ",result);
                        var u = $window.User.getIdentity();
                        userService.getToken({
                          email: u.data.email,
                          name: u.data.name,
                          stormId: u.data.id,
                          GitHubAccessToken:GitHubAccessToken
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
              }

            },
            "layout": {
              templateUrl: "views/layout/public.html"
            }
          }

        })
        .state('public.home', {
          url: "",
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
