'use strict';

/**
 * @ngdoc service
 * @name ngdeployApp.app
 * @description
 * # app
 * Service in the ngdeployApp.
 */
angular.module('ngdeployApp')
    .service('appService', function(API_ENDPOINT, $q, $http, $base64) {
        var self = this;
        self.zoneAlias = {
            post: function(data) {
                var defer = $q.defer();
                data.zoneId = data.zoneId.toLowerCase();
                if (!data.zoneId || data.zoneId == "") {
                    //// zone id is needed
                    return false;
                }
                $http.post(API_ENDPOINT + '/apps/zonealias', data).then(function(response) {
                    defer.resolve(response.data);

                }, function(response) {
                    defer.reject(response);

                });
                return defer.promise;
            }
        }
        self.zone = {
            put: function(data) {
                var defer = $q.defer();
                if (!data.zoneId || data.zoneId == "") {
                    ///// zone id is needed
                    return false;
                }
                if (!data.ssl) {
                    delete data.ssl;
                } else {
                    data.customsslkey = data.ssl.key;
                    data.customsslcert = data.ssl.certificate;
                }
                data.zoneId = data.zoneId.toLowerCase();

                $http.put(API_ENDPOINT + '/apps/zones', data).then(function(response) {
                    defer.resolve(response.data);

                }, function(response) {
                    defer.reject(response);

                });
                return defer.promise;
            }
        }

        self.get = function(page) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: API_ENDPOINT + '/apps'
            }).then(function(response) {
                defer.resolve(response.data);

            }, function(response) {
                defer.reject(response);

            });
            return defer.promise;

        }
        self.post = function(data) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/apps', data).then(function(response) {
                defer.resolve(response.data);

            }, function errorCallback(response) {
                defer.reject(response);

            });
            return defer.promise;

        }
        self.promote = function(data) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/apps/promotes', data).then(function(response) {
                defer.resolve(response.data);

            }, function errorCallback(response) {
                defer.reject(response);

            });
            return defer.promise;

        }
        self.upgrade = function(ngDeployUrl) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/apps/upgrades', {
                ngDeployUrl: ngDeployUrl
            }).then(function(response) {
                defer.resolve(response.data);

            }, function errorCallback(response) {
                defer.reject(response);

            });
            return defer.promise;

        }
        self.delete = function(ngDeployUrl) {
            var defer = $q.defer();
            var ngDeployUrl = ngDeployUrl.toLowerCase();
            $http.delete(API_ENDPOINT + '/apps/' + ngDeployUrl).then(function(response) {
                defer.resolve(response.data);

            }, function errorCallback(response) {
                defer.reject(response);

            });
            return defer.promise;

        }



        return self;


    });