'use strict';

/**
 * @ngdoc service
 * @name ngdeployApp.userService
 * @description
 * # userService
 * Service in the ngdeployApp.
 */
angular.module('ngdeployApp')
  .service('userService', function (API_ENDPOINT, $q, $http, stripe,STRIP_APIKEY) {
    var self = this;
    self.getToken = function (postData) {
      var defer = $q.defer();
      $http.post(API_ENDPOINT + '/tokens', postData).then(function (success) {
        defer.resolve(success.data.response);
      }, function (error) {
        defer.resolve(error.response);
      })
      return defer.promise;
    }
    self.tokens = {
      post: function () {
        var defer = $q.defer();

        $http.post(API_ENDPOINT + '/users/tokens').then(function (success) {
          defer.resolve(success.data.response);
        }, function (error) {
          defer.resolve(error.response);
        })
        return defer.promise;
      }
    }
    self.cards = {
      post: function (postData) {
        var defer = $q.defer();
        $http.post(API_ENDPOINT + '/users/cards', postData).then(function (success) {
          defer.resolve(success.data.response);
        }, function (error) {
          defer.reject(error.data.error.message);
        })
        return defer.promise;
      },
      get: function () {
        var defer = $q.defer();
        $http.get(API_ENDPOINT + '/users/cards').then(function (success) {
          defer.resolve(success.data.response);
        }, function (error) {
          defer.resolve(error.response);
        })
        return defer.promise;
      }
    };


    self.subscription = {
        get: function (){
          console.log("Grab user subscription...");
          var defer = $q.defer();
          $http.get(API_ENDPOINT+"/users/subscriptions").then(function(success){
            defer.resolve(success.data.response);
          },function(error){
            defer.resolve(error.response);
          })
          return defer.promise;
        }
    }

    self.upgrade = function (planId) {
      var defer = $q.defer();
      $http.post(API_ENDPOINT + '/users/subscriptions',{planId:planId}).then(function (success) {
        defer.resolve(success.data.response);
      }, function (error) {
        defer.resolve(error.response);
      })
      return defer.promise;
    }

    self.self = function () {
      var defer = $q.defer();
      $http.get(API_ENDPOINT + '/users/self').then(function (success) {
        defer.resolve(success.data.response);
      }, function (error) {
        defer.resolve(error.response);
      })
      return defer.promise;
    }


    return self;
  });
