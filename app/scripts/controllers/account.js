'use strict';

/**
 * @ngdoc function
 * @name ngdeployApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the ngdeployApp
 */
angular.module('ngdeployApp')
    .controller('AccountCtrl', function(DEBUG,$scope,$filter, $http,$state, stripe,userService,sweet,dbUser, $window) {
      $scope.user = dbUser;
      $scope.plans = [{name:'Free  - 0 premium', id:0, pId:'free'},
                      {name:'Developer - 1 premium $5/month', id:1, pId:'developer'},
                      {name:'Team - 5 premium $25/month', id:2, pId:'team'},
                      {name:'Business - 30 premium $150/month', id:3, pId:'business'}];

      $scope.selectedPlan = null;
      $scope.link_repo = {};
      $scope.link_repo.selected =  $scope.selectedPlan;


      $scope.changePlan = function(s){
        sweet.show({   title: "Are you sure?",
          text: "Are you sure you want to update to the \n " + s.name + " plan?",
          type: "success",
          showCancelButton: true,
          confirmButtonText: "Yes!",
          cancelButtonText: "Not yet",
          closeOnConfirm: true,
          closeOnCancel: true
        }, function(isConfirm){
            if(isConfirm){
              userService.upgrade(s.id);
            }
        });
      };


      $scope.cards = [];
      var loadCards = function() {
        userService.cards.get().then(function (cards) {
          $scope.cards = cards.data;
        });
      };

      if (DEBUG) {
        $scope.payment = {
          number : "4242424242424242",
          exp_year : 17,
          exp_month:10,
          csv : 1234
        };
        //code
      }





      $scope.linkGithub = function(){

        var u = $window.User.getIdentity();

        $window.OAuth.popup("github").then(function(p) {
          return u.addProvider(p);
        }).done(function() {
          sweet.show('Github Linked', 'Github linked to your account', 'success');

        });

      };
      $scope.newAccountToken = function(){
        sweet.show({
          title: 'Delete Account Token',
          text: 'Delete this account token and create a new one?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes please!',
          closeOnConfirm: false,
          closeOnCancel: false
        }, function (isConfirm) {
          if (isConfirm) {
            userService.tokens.post().then(function (res) {
              localStorage.removeItem('token');
              localStorage.setItem('token',res);
              sweet.show('Created!', 'New account token has been created');
              $state.go($state.current, {}, {reload: true});
            });

          } else {
            sweet.show('Cancelled', 'Nothing changed', 'error');
          }
        });
      };

        $scope.subscribe = function(form) {
          if (!$scope.payment) {
            return false;
          }
          var valid = stripe.card.validateCardNumber($scope.payment.number);



           stripe.card.createToken($scope.payment)
                .then(function(response) {

                  userService.cards.post({
                    stripeToken:response.id,
                    debug:true
                  }).then(function(response){
                    sweet.show('Card added!', 'Card has been added to your account..', 'success');
                    loadCards();
                  },function(error){
                    sweet.show('Oh no!', error, 'error');
                  })

                }, function(error){
                  sweet.show('Oh no!', error, 'error');
                });
        }


      $scope.getSubscription = function (){
        userService.subscription.get($scope.user.customerId).then(function(response){

          var i = $filter('filter')($scope.plans, {pId: response},true);

          if( i.length > 0 ){
            $scope.selectedPlan = i[0];
            $scope.link_repo.selected = i[0];
          }else{
            $scope.link_repo.selected = $scope.plans[0];
          }

        },function(error){
          console.log("Error retrieving subscriptions. ", error);
        })
      }

      loadCards();
      $scope.getSubscription();
    });
