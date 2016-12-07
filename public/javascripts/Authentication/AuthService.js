/**
 * Created by nickdestefano on 6/23/15.
 */
var app = angular.module('Auth', []);

app.factory('auth', function($http, $window){
    var auth = {};

    auth.saveToken = function (token){
        $window.localStorage['vendor-token'] = token;
    };

    auth.getToken = function (){
        return $window.localStorage['vendor-token'];
    };

    auth.isLoggedIn = function(){
        var token = auth.getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function(user){
        return $http.post('/register', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user){
        return $http.post('/login', user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function(){
        $window.localStorage.removeItem('vendor-token');
    };

    return auth;
})