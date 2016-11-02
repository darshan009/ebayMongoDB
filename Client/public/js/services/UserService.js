angular.module('UserService', [])
  .factory('User', ['$http', function($http) {
    return {
        // call to get all nerds
        get : function() {
            return $http.get('/users');
        },

        // call to POST and create a new nerd
        create : function(nerdData) {
            return $http.post('/api/addUser', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/deleteUser/' + id);
        }
    }
    console.log("in user service");
}]);
