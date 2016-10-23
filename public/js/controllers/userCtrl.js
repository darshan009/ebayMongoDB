angular.module('UserCtrl', [])
  .controller('UserController', function($scope, $http) {

    //user signup validation section




    //get current user details
    $http({
      method : "POST",
      url : '/api/currentUser'
    }).success(function(data) {
      console.log("success currentUser");
      console.log(data);
      if(data){
        $scope.currentUser = data;
        // $scope.currentUserBirthday = new Date(data.birthday.getYear(), data.birthday.getMonth(), data.birthday.getDate(), 0 , 0, 0, 0);
        $scope.lastLoginTime = data.lastLogin;
      }
    }).error(function(error) {
      console.log("Error posting data in currentUser");
    });

    /*
     |-----------------------------------------------------------
     | User login signup
     |-----------------------------------------------------------
    */

    //user login
    $scope.login = function() {
      $http({
        method : "POST",
        url : '/api/login',
        data : {
          "email": $scope.email,
          "password": $scope.password
        }
      }).success(function(data) {
        console.log("success login");
        console.log(data);
        window.location = '/';
        // $locationProvider.path('/login');
      }).error(function(error) {
        console.log("Error posting data in addToCart");
      });
    }

    //user signup
    $scope.signup = function() {
      $http({
        method : "POST",
        url : '/api/signup',
        data : {
          "firstName": $scope.firstName,
          "lastName": $scope.lastName,
          "username": $scope.username,
          "email": $scope.email,
          "password": $scope.password,
          "birthday": $scope.birthday,
          "contactNo": $scope.contactNo,
          "address": $scope.address,
          "location": $scope.location
        }
      }).success(function(data) {
        console.log("success login");
        console.log(data);
        window.location = '/login';
        // $locationProvider.path('/login');
      }).error(function(error) {
        console.log("Error posting data in addToCart");
      });
    };


    /*
     |-----------------------------------------------------------
     | User advertisements
     |-----------------------------------------------------------
    */

    $scope.addAdvertisement = function(){
      console.log("-------in addAdvertisement------");
      $http({
        method : "POST",
        url : '/api/addAdvertisement',
        data : {
          "name": $scope.name,
          "specification": $scope.specification,
          "quantity": $scope.quantity,
          "shipping": $scope.shipping,
          "price" : $scope.price,
          "biddingStatus" : $scope.biddingStatus
        }
      }).success(function(data) {
        $scope.name = '';
        $scope.specification = '';
        $scope.quantity = '';
        $scope.shipping = '';
        $scope.price = '';
      }).error(function(error) {
        console.log("Error posting data in addAdvertisement");
      });
    };

    //loads user Advertisement
    $scope.allAdvertisement = function() {
      console.log("in allAdvertisement");
      $http({
        method : "POST",
        url : '/api/allAdvertisement'
      }).success(function(data) {
        console.log("success in allAdvertisement");
        console.log(data);
        $scope.allAd = data;
      }).error(function(error) {
        res.end("Error posting data in all Advertisement");
      });
    };

    /*
     |-----------------------------------------------------------
     | sold and purchased items
     |-----------------------------------------------------------
    */
    $http({
      method : "POST",
      url : '/api/soldItems'
    }).success(function(data) {
      console.log("success in soldItems");
      console.log(data);
      $scope.soldItemsData = data;
    }).error(function(error) {
      res.end("Error posting data");
    });

    $http({
      method : "POST",
      url : '/api/purchasedItems'
    }).success(function(data) {
      console.log("success in purchasedAd");
      console.log(data);
      $scope.purchasedAd = data;
    }).error(function(error) {
      console.log("Error posting data");
    });


    // // $scope.helloTest = "no";
    // // $scope.loadAdvertisement = function(adId) {
    // //   console.log("---------in loadSingleAdvertisement----------");
    // //   console.log(adId);
    // //   $scope.helloTest = "lol";
    // //   $http({
    // //     method : "POST",
    // //     url : '/loadSingleAdvertisement',
    // //     data : {
    // //       "adId" : adId
    // //     }
    // //   }).success(function(data) {
    // //     console.log("success in purchasedAd");
    // //     console.log(data);
    // //     $scope.singleAdData = data[0];
    // //     console.log($scope.singleAdData);
    // //     // $state.go('advertisement', {});
    // //   }).error(function(error) {
    // //     console.log("Error posting data");
    // //   });
    // // };
    //
    // $scope.placeBid = function(adId, biddingValue, quantityEntered) {
    //   $http({
    //     method : "POST",
    //     url : '/placeBid',
    //     data : {
    //       "adId" : adId,
    //       "quantityEntered" : quantityEntered,
    //       "biddingValue" : biddingValue
    //     }
    //   }).success(function(data) {
    //     console.log("success in placeBid");
    //     console.log(data);
    //     $scope.quantityEntered = "";
    //     $scope.biddingValue = "";
    //     // $state.go('advertisement', {});
    //   }).error(function(error) {
    //     console.log("Error posting data");
    //   });
    // };
    //
    // // $scope.loadBid = function() {
    // //   $http({
    // //     method : "GET",
    // //     url : '/getBids'
    // //   }).success(function(data) {
    // //     console.log("in load Bid");
    // //     console.log(data);
    // //     $scope.loadBid = data;
    // //   }).error(function(error) {
    // //     console.log("Error posting data");
    // //   });
    // // };


});
