var express = require('express');
const multer = require("multer");
const { check } = require('express-validator');
var router = express.Router();
const constants = require('../utils/constants');
const authHelper = require('../utils/authHelpers');

/* GET home page. */
router.use('/', function(req,res,next){
  res.locals.currentUrl = constants.BLOG;
  next();
})

router.get('/', function(req, res, next){
    res.redirect('/blog/posts')
});

router.get('/posts', function(req, res, next) {
  res.render('blog/home', {});
});

router.get('/posts/:postId/:postSlug', function(req, res, next) {
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

});

module.exports = router;
