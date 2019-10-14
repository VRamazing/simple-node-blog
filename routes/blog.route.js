var express = require('express');
const multer = require("multer");
const { check } = require('express-validator');
var router = express.Router();
const constants = require('../utils/constants');
const authHelper = require('../utils/authHelpers');
var Post = require('../models/post.model');

/* GET home page. */
router.use('/', function(req,res,next){
  res.locals.currentUrl = constants.BLOG;
  next();
})

router.get('/', function(req, res, next){
    res.redirect('/blog/posts')
});

router.get('/posts', function(req, res, next) {
  // Find all posts
  // Find and sort posts by dates,
  // Calculate and send pagination

  
  res.render('blog/home', {
    posts: [{
      'title': 'Things I learned from Ayn Rand',
      'content': 'Et esse eu adipisicing commodo eu velit minim ex laborum deserunt.',
      'content_trimed': 'Et esse eu adipisicing commodo eu velit minim ex laborum deserunt.',
      'author': 'vignesh',
      'category': 'life',
      'thumbnail': 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'createdDate': new Date(),
      'postDetailLink': '/blog/posts/Things_I_learned_from_Ayn_Rand'
    }],
    recentPosts: ['/blog/posts/Things_I_learned_from_Ayn_Rand'],
    pages: 2,
  });
});

router.get('/posts/:postSlug', function(req, res, next) {
  res.render('blog/post', {});
});

router.get('/posts/new', authHelper.isLoggedIn, function(req, res, next) {
  res.locals.currentUrl = 'NEW_POST';
  var username;
  if(!req.user.name){
    username= 'Anonymous'
  }
  else{
    username = req.user.name
  }
  res.render('blog/create_post', {author_name: username});
});

router.post('/posts/new', authHelper.isLoggedIn, function(req, res, next) {
  

  // res.redirect('/blog')
});

module.exports = router;
