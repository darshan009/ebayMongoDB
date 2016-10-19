angular.module('appRoutes', ['ui.router'])
  .config(['$routeProvider', '$stateProvider', '$locationProvider', function($routeProvider, $stateProvider, $locationProvider) {
    $routeProvider
        // home page
        .when('/', {
            templateUrl: '../views/index.ejs',
            controller: 'MainController'
        })

        // UserController
        .when('/users', {
            templateUrl: '../views/user.ejs',
            controller: 'UserController'
        })
        .when('/login', {
            templateUrl: '../views/login.ejs',
            controller: 'UserController'
        })
        .when('/signup', {
            templateUrl: '../views/signup.ejs',
            controller: 'UserController'
        });
    // $stateProvider
    //   .state('app', {
    //     abstract: true,
    //     templateUrl : '../views/test.ejs'
    //   })
    //   .state('home', {
    //     url: '/',
    //     templateUrl : '../views/index.ejs',
    //     controller: 'MainController'
    //   })
    //   .state('login', {
    //     url : '/login',
    //     templateUrl : '../views/login.ejs',
    //     controller: 'UserController'
    //   });
    $locationProvider.html5Mode(true);
    console.log("in appRoutes");
  }]);
