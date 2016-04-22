'use strict';
/**
 * @ngdoc overview
 * @name ngdeployApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('ngdeployApp')



// configure views; whenAuthenticated adds a resolve method to ensure users authenticate
// before trying to access that route
.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'jwtInterceptorProvider', '$httpProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider) {


        jwtInterceptorProvider.tokenGetter = [

            function() {
                var token = localStorage.getItem('token');
                console.log(token)
                return token;
            }
        ];

        $httpProvider.interceptors.push('jwtInterceptor');




        $urlRouterProvider.rule(function($injector, $location) {
            var path = $location.url();

            // check to see if the path already has a slash where it should be
            if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
                return;
            }

            if (path.indexOf('?') > -1) {
                return path.replace('?', '/?');
            }

            return path + '/';
        });



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
                                        console.log(result)
                                        $rootScope.$broadcast('USER::LOGIN', result);
                                        $window.User.signin(result).then(function(result) {


                                            var u = $window.User.getIdentity();
                                            userService.getToken({
                                                name: u.data.name,
                                                stormId: u.data.id
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
                url: "/",
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
            resolve: {
                token: function($q, $window, userService) {
                    if ($window.User.isLogged()) {


                        var u = $window.User.getIdentity();

                        var token = localStorage.getItem('token');
                        if (!token) {
                            userService.getToken({
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
            .state('private.apps', {
                url: "/apps/",
                views: {
                    "main": {
                        templateUrl: "views/private/apps.html",
                        controller: function($scope, appService, token, userService, $uibModal, $log, sweet) {
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

                                    $scope.loadApps();
                                    console.log(response);
                                })
                            }


                            $scope.promote = function(app, phase) {
                                sweet.show({
                                    title: 'Confirm',
                                    text: 'Promote to ' + phase + '?',
                                    type: 'success',
                                    showCancelButton: true,
                                    confirmButtonColor: '#DD6B55',
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
                                        sweet.show('Cancelled', 'Your imaginary file is safe :)', 'error');
                                    }
                                });
                            }

                            $scope.delete = function(ngDeployUrl) {

                                sweet.show({
                                    title: 'Confirm',
                                    text: 'Delete this application?',
                                    type: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#DD6B55',
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
                                        sweet.show('Cancelled', 'Your imaginary file is safe :)', 'error');
                                    }
                                });


                            }



                            $scope.setupHosting = function(app) {
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'setupHosting.html',
                                    controller: 'setupHostingCtrl',
                                    size: 'sm',
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
                            $scope.loadApps();
                        }
                    }
                }
            })

    }
]).controller('setupHostingCtrl', function($scope, appService, app) {
    $scope.save = function(hosting) {
        hosting.id = app.id;
        var data = angular.copy(hosting);
        appService.hosting.post(data).then(function(results) {
            if ($scope.ssl) {
                $scope.ssl.key = '';
                $scope.ssl.cert = '';
            }
        })
    }

}).controller('createApplicationModalCtrl', function($scope, appService) {
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