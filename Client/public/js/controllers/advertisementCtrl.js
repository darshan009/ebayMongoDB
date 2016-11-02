angular.module('AdvertisementCtrl', [])
  .controller('AdvertisementController', function($scope, $http, $state, $stateParams) {


    /*
     |-----------------------------------------------------------
     | User activity tracking function
     |-----------------------------------------------------------
    */
    $scope.userLogs = function(clickEvent){
      $http({
        method : "POST",
        url : '/api/userLogs',
        data : {
          "clickEvent": clickEvent
        }
      }).success(function(data) {
        console.log("success userLogs");
        console.log(data);
      }).error(function(error) {
        console.log("Error posting data in user logs");
      });
    };



      //get Advertisement detail for selling
      $http({
        method : "POST",
        url : '/api/getAdvertisementDetail/'+$stateParams.adId
      }).success(function(data) {
        console.log("success get selling advertisement");
        console.log(data);
        if(data){
          $scope.allSellingAdvertisement = data;
        }
        if(data.biddingStatus == true) {
          $scope.bidding = true;
        }
        else {
          $scope.bidding = false;
        }
      }).error(function(error) {
        console.log("Error posting data in currentUser");
      });

      $scope.placeBid = function(quantityEntered, biddingValue) {
        $http({
          method : "POST",
          url : '/api/placeBid',
          data : {
            "adId" : $stateParams.adId,
            "quantityEntered": quantityEntered,
            "biddingValue" : biddingValue
          }
        }).success(function(data) {
          console.log("success placing bid");
          console.log(data);
          if(data.bids) {
            $scope.lastEnteredBid = data.lastBid.biddingValue;
          }
          window.location.reload();
        }).error(function(error) {
          console.log("Error posting data in currentUser");
        });
      };

      //
      $scope.addToCart = function(quantityEntered) {
        console.log("in addToCart "+$stateParams.adId);
        console.log(quantityEntered);
        $http({
          method : "POST",
          url : '/api/addToCart',
          data : {
            "adId" : $stateParams.adId,
            "quantityEntered" : quantityEntered
          }
        }).success(function(data) {
          console.log("success");
          console.log(data);
        }).error(function(error) {
          console.log("Error posting data in addToCart");
        });
      };

});
