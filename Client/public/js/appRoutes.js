angular.module('appRoutes', ['ui.router'])
  .config(['$routeProvider', '$stateProvider', '$locationProvider', function($routeProvider, $stateProvider, $locationProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl : '../views/test.ejs'
      })
      .state('home', {
        url: '/',
        templateUrl : '../views/index.ejs',
        controller: 'MainController'
      })
      .state('login', {
        url : '/login',
        templateUrl : '../views/login.ejs',
        controller: 'UserController'
      })
      .state('signup', {
        url : '/signup',
        templateUrl : '../views/signup.ejs',
        controller: 'UserController'
      })

      //get Advertisement
      .state('getAdvertisementDetail', {
        url : '/getAdvertisementDetail/:adId',
        templateUrl : '../views/getAdvertisementDetail.ejs',
        controller: 'AdvertisementController'
      })

      //shopping Cart
      .state('shoppingCart', {
        url : '/shoppingCart',
        templateUrl : '../views/shoppingCart.ejs',
        controller: 'MainController'
      })

      //checkout
      .state('checkout', {
        url : '/checkout',
        templateUrl : '../views/checkout.ejs',
        controller: 'MainController'
      })

      //profile page states
      .state('profile', {
        url : '/profile',
        templateUrl : '../views/profile/profile.ejs',
        controller: 'UserController'
      })
      .state('profile.personalDetails', {
        url: '/personalDetails',
        views: {
          'profileView': {
            templateUrl: '../views/profile/personalDetails.ejs',
            controller: 'UserController'
          }
        }
      })
      .state('profile.allAdvertisement', {
        url: '/allAdvertisement',
        views: {
          'profileView': {
            templateUrl: '../views/profile/allAdvertisement.ejs',
            controller: 'UserController'
          }
        }
      })
      .state('profile.addAdvertisement', {
        url: '/addAdvertisement',
        views: {
          'profileView': {
            templateUrl: '../views/profile/addAdvertisement.ejs',
            controller: 'UserController'
          }
        }
      })
      .state('profile.itemsPurchased', {
        url: '/itemsPurchased',
        views: {
          'profileView': {
            templateUrl: '../views/profile/itemsPurchased.ejs',
            controller: 'UserController'
          }
        }
      })
      .state('profile.itemsSold', {
        url: '/itemsSold',
        views: {
          'profileView': {
            templateUrl: '../views/profile/itemsSold.ejs',
            controller: 'UserController'
          }
        }
      })
      .state('profile.getBids', {
        url: '/getBids',
        views: {
          'profileView': {
            templateUrl: '../views/profile/getBids.ejs',
            controller: 'UserController'
          }
        }
      });
    $locationProvider.html5Mode(true);
    console.log("in appRoutes");
  }]);
