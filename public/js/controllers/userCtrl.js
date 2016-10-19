angular.module('UserCtrl', [])
  .controller('UserController', function($scope, $http) {

    //user signup validation section


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
    }

});
