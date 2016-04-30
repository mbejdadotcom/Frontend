'use strict';

/**
 * @ngdoc service
 * @name ngdeployApp.teams
 * @description
 * # teams
 * Service in the ngdeployApp.
 */
angular.module('ngdeployApp')
    .service('teams', function(API_ENDPOINT, $q, $http, $base64) {
        var self = this;
        self.delete = function(data) {
            var defer = $q.defer();
            $http.delete(API_ENDPOINT + '/apps/'+data.appId+'/teams/'+data.userId).then(function(response) {
                defer.resolve(response.data);

            }, function(response) {
                defer.reject(response);

            });
            return defer.promise;
        }
        self.post = function(data) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/apps/teams', data).then(function(response) {
                defer.resolve(response.data);

            }, function(response) {
                defer.reject(response);

            });
            return defer.promise;
        }
        self.get = function(appId) {
            var defer = $q.defer();
            $http.get(API_ENDPOINT + '/apps/' + appId + '/teams').then(function(response) {
                defer.resolve(response.data);

            }, function(response) {
                defer.reject(response);

            });
            return defer.promise;
        }
        return self;
    });
