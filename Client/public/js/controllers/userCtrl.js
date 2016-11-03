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
        var date = new Date(data.birthday),
            month = date.getMonth(),
            year = date.getYear(),
            day = date.getDate();
        console.log(year);
        var fullBirthday = month+'/'+day+'/'+year;
        $scope.fullBirthday = fullBirthday;
        $scope.lastLoginTime = data.lastLoginDateTime;
      }
    }).error(function(error) {
      console.log("Error posting data in currentUser");
    });

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

    //user logout
    $scope.logout = function() {
      console.log("---------------------in logout");
      $http({
        method : "POST",
        url : '/api/logout'
      }).success(function(data) {
        console.log("success logout");
        window.location = '/';
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
        console.log("-------in addAdvertisement success------");
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

});
