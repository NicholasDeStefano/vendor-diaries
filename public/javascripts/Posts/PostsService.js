/**
 * Created by nickdestefano on 6/23/15.
 */
var app = angular.module('PostsService', []);

app.factory('posts', function($http, auth){
    var o = {
        posts: []
    };

    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    o.create = function(post) {
        return $http.post('/posts', post, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            o.posts.push(data);
        });
    };

    o.upvote = function(post, currentUser) {
        return $http.put('/posts/' + post._id + '/upvote', {user: currentUser}, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            if(data.message){
                return;
            } else {
                console.log(data);
                post.upvotes += data.upvotes.length;
            }
        });
    };

    o.update = function(post) {
        console.log('you have hit the post.update path', post);
        return $http.put('/posts/' + post._id, {updatedPost: post}, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            post = data.post;
        })
    }

    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        });
    };

    o.upvoteComment = function(post, comment, currentUser) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', {user: currentUser}, {
            headers: {Authorization: 'Bearer '+auth.getToken()}
        }).success(function(data){
            if(data.message){
                return;
            } else {
                console.log(data);
                comment.upvotes += data.upvotes.length;
            }
        });
    };
    return o;
});