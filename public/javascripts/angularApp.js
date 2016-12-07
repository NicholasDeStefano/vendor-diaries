/**
 * Created by nickdestefano on 6/22/15.
 */
var app = angular.module('vendor', ['ui.router', 'PostsModule', 'PostsService', 'Auth', 'AuthCtrl', 'Main']);

app.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: function(posts){
                        return posts.getAll();
                    }
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: 'views/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'AuthCtrl',
                onEnter: function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'views/register.html',
                controller: 'AuthCtrl',
                onEnter: function($state, auth){
                    if(auth.isLoggedIn()){
                        $state.go('home');
                    }
                }
            });

        $urlRouterProvider.otherwise('home');
    });

app.controller('NavCtrl', function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
});