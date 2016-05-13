'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('AccountCtrl', function(DEBUG,$scope, $http, stripe,userService) {
      if (DEBUG) {
        $scope.payment = {
          number : "4242424242424242",
          exp_year : 17,
          exp_month:10,
          csv : 1234
        }
        //code
      }
        $scope.subscribe = function(form) {
          if (!$scope.payment) {
            return false;
          }
          var valid = stripe.card.validateCardNumber($scope.payment.number);
          

  
           stripe.card.createToken($scope.payment)
                .then(function(response) {
                  console.log(response)
                  userService.subscribe({
                    stripeToken:response.id,
                    debug:true
                  }).then(function(response){
                    console.log(response);
                    
                  })

                }, function(error){
                  console.log(error);
                });
        }

    });