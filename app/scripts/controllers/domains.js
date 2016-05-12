'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('DomainsCtrl', function($scope,$stateParams, appService) {

        $scope.cname = "cname"
        $scope.appId = $stateParams.appId;

appService.fetch($scope.appId).then(function(results) {
            $scope.app = results.response;
              $scope.cname = $scope.app.ngDeployUrl+".ngdeploy.com";

        }, function(error) {

        })


        $scope.addDomain = function(domain) {
            var postData = {}
            postData.ngDeployUrl = $scope.app.ngDeployUrl;
            if (domain) {
                postData.domain = domain;
                appService.domains.post(postData).then(function(results) {

                    console.log(results);
                });
            }
        }
        $scope.addSSL = function(ssl) {
            var postData = {}
            postData.ngDeployUrl = $scope.app.ngDeployUrl;
            if (ssl  && ssl.key && ssl.certificate) {
                postData.ssl = "enabled";
                postData.sslKey = ssl.key;
                postData.sslCert = ssl.certificate;
                appService.ssls.post(postData).then(function(results) {
                    if ($scope.ssl) {
                        $scope.ssl.key = '';
                        $scope.ssl.cert = '';
                    }
                })
            } else {
                postData.ssl = "disabled";
                appService.ssls.post(postData).then(function(results) {
                    if ($scope.ssl) {
                        $scope.ssl.key = '';
                        $scope.ssl.cert = '';
                    }
                })
            }
        }



    });
