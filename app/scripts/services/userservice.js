'use strict';

/**
 * @ngdoc service
 * @name ngdeployApp.userService
 * @description
 * # userService
 * Service in the ngdeployApp.
 */
angular.module('ngdeployApp')
    .service('userService', function(API_ENDPOINT, $q, $http) {
        var self = this;
        self.getToken = function(postData) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/tokens', postData).then(function(success) {
                defer.resolve(success.data.response);
            }, function(error) {
                defer.resolve(error.response);
            })
            return defer.promise;
        }
        self.subscribe = function(postData) {
            var defer = $q.defer();
            $http.post(API_ENDPOINT + '/users/subscribes', postData).then(function(success) {
                defer.resolve(success.data.response);
            }, function(error) {
                defer.resolve(error.response);
            })
            return defer.promise;
        }
        
        self.self = function() {
            var defer = $q.defer();
            $http.get(API_ENDPOINT + '/users/self').then(function(success) {
                defer.resolve(success.data.response);
            }, function(error) {
                defer.resolve(error.response);
            })
            return defer.promise;
        }


        return self;
    });