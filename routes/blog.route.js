const mongoose  = require("mongoose");
var express = require('express');
const multer = require("multer");
const { check } = require('express-validator');
const authHelper = require('../utils/authHelpers');
var Post = require('../models/post.model');

const constants = require('../utils/constants');
var utils =require('../utils/utils');

var csurf = require('csurf');

var router = express.Router();

const csrfProtection = csurf();

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, './uploads/posts');
  },
  filename: function(req, file, cb){
      cb(null, new Date().toISOString().replace(/:|\./g,'')  + '__' + file.originalname)
  }
})

const fileFilter = (req, file, cb) =>{
  if(file.mimetype === 'image/jpeg' || file.mimetype == 'image/png'){
      cb(null, true);
  }
  else{
      cb(req.flash("error", "File type not accepted. Please upload png/jpeg"), false);
  }
}

//supports a file of 10MB for thumbnail avatar image
const upload = multer({storage: storage, limits: {
fileSize: 1024 * 1024 * 10
}, fileFilter: fileFilter})

router.use(csrfProtection);

/* GET home page. */
router.use('/', function(req,res,next){
  res.locals.currentUrl = constants.BLOG;
  next();
})

router.get('/', function(req, res, next){
    res.redirect('/blog/posts')
});

router.get('/posts', function(req, res, next) {
  // Calculate and send pagination - 10 posts per page. Total post/4
  // Move top 5 recent posts links to recentPosts key

  Post.find({}, function (err, posts) {
    if (err) return console.error(err);
    res.render('blog/home', {
      posts: posts.reverse(),
      //dummy
      recentPosts: ['/blog/posts/Things_I_learned_from_Ayn_Rand'],
      pages: 2,
    });
  })
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
  res.render('blog/create_post', {author_name: username,  csrfToken: req.csrfToken()});
});

router.get('/posts/:postSlug/', function(req, res, next) {
  var postTitle = utils.convertUrlIdToTitleString(req.params.postSlug);
  Post.findOne({title: postTitle}, function(err, post){
    if (err) return console.error(err);
    console.log(post);
    res.render('blog/post', {post: post});
  })
});

router.post('/posts/new', authHelper.isLoggedIn, upload.single('thumbnail'), function(req, res, next) {
  // console.log('I entered here')
  var post = new Post();

  post.title = utils.capitalizeFirstLetter(req.body.title);
  post.content = req.body.content;
  post.author = req.user.name;
  post.category = req.body.category;
  post.thumbnail = constants.POST_THUMBNAIL_URL + req.file.filename;
  post.createdDate = new Date().toDateString();
  post._id = new mongoose.Types.ObjectId();
  post.detailLink = constants.POSTS_URL + utils.convertStringToUrlFriendly(req.body.title)

  post.save(function (err, currentPost) {
    if (err) return console.error(err);
    console.log(currentPost);
    console.log(currentPost.title + " saved to blog.");
  }); 

  res.redirect('/blog');
});

module.exports = router;
