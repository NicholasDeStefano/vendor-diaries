var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var passport = require('passport');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var sessions = require('../controllers/sessions');
router.post('/register', sessions.register);
router.post('/login', sessions.login);

/////***** POSTS ROUTES *****/////
var posts = require('../controllers/posts');

router.param('post', posts.post);
router.get('/posts', posts.index);

// POST new Post
router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function(err, post){
        if(err){ return next(err); }

        res.json(post);
    });
});

// GET Post by ID
router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

// Update a post
router.put('/posts/:post', auth, function(req, res, next) {
    var post = req.post;
    delete post.createdAt;
    post.title = req.body.updatedPost.title;
    post.link = req.body.updatedPost.link;
    post.save(function(err, post){
        if(err){
            console.log(err);
            return next(err); }
        console.log("this is the post that was updated", post);
        res.json(post)
    });
});

// Upvote a post
router.put('/posts/:post/upvote', auth, function(req, res, next) {
    var user = req.body.user;
    var userExists = userAlreadyUpVoted(req.post.upvotes, user);
    if(userExists.length === 0){
        console.log("this user doesn't exist")
        req.post.upvotes.push(user);
        req.post.save(function(err, post){
            if(err){ return next(err); }
            console.log("this is the post that was updated", post);
            res.json(post)
        });
    } else {
        console.log('this user already exists')
        res.json({message:'user already upvoted'});
    }
});

//Comment Param
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) {return next(err); }
        if (!comment) { return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    })
})

router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});

// Upvote a comment
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    var user = req.body.user;
    var comment = req.comment;
    var userExists = userAlreadyUpVoted(req.comment.upvotes, user);
    if(userExists.length === 0){
        console.log("this user doesn't exist")
        comment.upvotes.push(user);
        console.log(comment);
        comment.save(function(err, comment){
            if(err){return next(err); }

            req.post.save(function(err, post) {
                if(err){ return next(err); }

                res.json(comment);
            });
        });
    } else {
        console.log('this user already exists')
        res.json({message:'user already upvoted'});
    }
})

function userAlreadyUpVoted(voters, user){
    var status = voters.filter(function(voter){
        return voter === user;
    });
    return status;
}

module.exports = router;
