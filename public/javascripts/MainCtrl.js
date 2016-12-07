var app = angular.module('Main', []);

app.controller('MainCtrl', function($scope, posts, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    var currentUser = auth.currentUser();
    $scope.currentUser = currentUser;
    $scope.posts = posts.posts;

    $scope.addingPost = false;

    $scope.categories = [
        {id: 0, name: "Analytics"},
        {id: 1, name: "Social Media"},
        {id: 2, name: "Creative"},
        {id: 3, name: "Production"},
        {id: 4, name: "Ad Tech"}
    ];

    $scope.cancelPost = function() {
        $scope.addingPost = false;
        $scope.title = '';
        $scope.link = '';
        $scope.description = '';
        $scope.categoryChoice = null;
    }
    
    $scope.updatePost = function(editedPost){
        var index = _.findIndex($scope.posts, function(p){
            console.log(p);
            return p._id == editedPost._id;
        })
        $scope.posts[index] = editedPost;
    }

    $scope.addPost = function(){
        if(!$scope.title || $scope.title === '') { return; }
        posts.create({
            title: $scope.title,
            link: $scope.link,
            description: $scope.description,
            category: $scope.categoryChoice
        });
        $scope.title = '';
        $scope.link = '';
        $scope.description = '';
        $scope.categoryChoice = null;

        $scope.addingPost = false;
    };

    $scope.incrementUpvotes = function(post) {
        posts.upvote(post,currentUser );
    };

});