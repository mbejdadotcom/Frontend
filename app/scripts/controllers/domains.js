'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:DomainsCtrl
 * @description
 * # DomainsCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('DomainsCtrl', function($scope,$stateParams, appService,sweet) {

        $scope.cname = "cname";
        $scope.appId = parseInt($stateParams.appId);

appService.fetch($scope.appId).then(function(results) {
            $scope.app = results.response;
              $scope.cname = $scope.app.ngDeployUrl+".ngdeploy.com";

        }, function(error) {

        })


        $scope.addDomain = function(domain) {
            var postData = {}
            postData.id =  $scope.appId;
            if (domain) {
                postData.domain = domain;
                appService.domains.post(postData).then(function(results) {
                  sweet.show('Domain added!', 'Domain has been added to your application', 'success');

                },function(error){
                  console.log(error);
                  sweet.show('Error occured ', 'Domain was not added. Please contact support | '+error, 'error');

                });
            }
        }
        $scope.addSSL = function(ssl) {
            var postData = {}
            postData.id = $scope.appId;
            if (ssl  && ssl.key && ssl.certificate) {
                postData.ssl = "enabled";
                postData.sslKey = ssl.key;
                postData.sslCert = ssl.certificate;
                appService.ssls.post(postData).then(function(results) {
                    if ($scope.ssl) {
                        $scope.ssl.key = '';
                        $scope.ssl.cert = '';
                    }
                },function(error){
                  sweet.show('Error occured ', 'SSL was not added. Please contact support | '+error, 'error');

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
