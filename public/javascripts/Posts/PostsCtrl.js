/**
 * Created by nickdestefano on 6/22/15.
 */
var app = angular.module('PostsModule', []);

app.controller('PostsCtrl', function($scope, posts, post, auth){

    $scope.isLoggedIn = auth.isLoggedIn;
    var currentUser = auth.currentUser();
    $scope.post = post;

    $scope.addComment = function(){
        if($scope.body === '') { return; }
        posts.addComment(post._id, {
            body: $scope.body,
            author: 'user',
        }).success(function(comment){
            $scope.post.comments.push(comment);
        });
        $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment){
        posts.upvoteComment(post, comment, currentUser);
    };

});