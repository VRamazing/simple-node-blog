const mongoose  = require("mongoose");
var express = require('express');
const multer = require("multer");
const { check, validationResult } = require('express-validator');

const authHelper = require('../utils/authHelpers');
var Post = require('../models/post.model');

const constants = require('../utils/constants');
var utils =require('../utils/utils');

var csurf = require('csurf');

var router = express.Router();

var recentPosts = []

const csrfProtection = csurf();

const postsPerPage = 2;

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

router.get('/', function(req, res, next){
    res.locals.currentUrl = constants.BLOG;
    res.redirect('/blog/posts/0');
});

router.get('/:page', function(req, res, next) {
  // Calculate and send pagination - 10 posts per page. Total post/4
  // Move top 5 recent posts links to recentPosts key
  var currentPage = parseInt(req.params.page);
  var previousPage, nextPage;

  console.log("Current page is", currentPage)

  if(isNaN(currentPage)){
    res.status(404)
    return res.redirect('/error/pagenotfound')
  }
  
  Post.countDocuments({}, function (err, count){
    if(err){
      console.log(err)
    }

    var totalPages = Math.ceil(count/postsPerPage);
    var postsToSkip = postsPerPage * currentPage;


    // if(currentPage == 0){
    //   previousPage=null;
    // }
    // else{
    //   previousPage-=1;
    // }

    // if(currentPage == totalPages){totalPages
    //   nextPage=null;
    // }
    // else{
    //   nextPage+=1;
    // }

    Post.find()
    .limit(postsPerPage)
    .skip(postsToSkip)
    .sort({
        _id: -1
    })
    .exec(function(err, posts) {
      if(err) console.log(err);
      console.log("Total pages", totalPages)

      res.render('blog/home', {
        posts: posts,
        pages: totalPages,
        style: ['blog-post.css'],
        previousPage: previousPage,
        nextPage: nextPage,
        noPost: count==0
      });
    })
  });
});

router.get('/new', authHelper.isLoggedIn, function(req, res, next) {
  res.locals.currentUrl = 'NEW_POST';
  res.render('blog/create_post', {csrfToken: req.csrfToken()});
});

router.get('/:postSlug/', function(req, res, next) {
  var postTitle = utils.convertUrlIdToTitleString(req.params.postSlug);
  Post.findOne({title: postTitle}, function(err, post){
    if (err) return
    res.render('blog/post', {post: post, recentPosts: recentPosts, style: ['blog-post.css']});
  })
});

router.get('/posts/search/:postSlug/', function(req, res, next) {
  /*var postTitle = utils.convertUrlIdToTitleString(req.params.postSlug);*/
  
  /*Post.findOne({title: postTitle}, function(err, post){
    if (err) return console.error(err);
    console.log(post);
    res.render('blog/post', {post: post, recentPosts: recentPosts, style: ['blog-post.css']});
  })*/
});

router.post('/new', 
  authHelper.isLoggedIn, 
  upload.single('thumbnail'),
  [
    check('title', 'Title should have atleast 5 characters').exists().trim().isLength({ min: 10 }),
    check('content', 'Content should have atleast 20 characters').exists().trim().isLength({ min: 20 }),
    check('category', 'Select the correct category').exists().not().equals("select"),
  ],
  function(req, res, next) {
    var messages = validationResult(req)
    const hasErrors = !messages.isEmpty();

    if(hasErrors){
      return res.render('blog/create_post', { messages: messages.array(), hasErrors: hasErrors,  csrfToken: req.csrfToken()});
    }
    
    var post = new Post();
    post.title = utils.capitalizeFirstLetter(req.body.title);
    post.content = req.body.content;
    post.author = req.user.name;
    post.category = req.body.category;
    post.thumbnail = constants.POST_THUMBNAIL_URL + req.file.filename;
    post.createdDate = new Date().toUTCString();
    post._id = new mongoose.Types.ObjectId();
    post.detailLink = constants.POSTS_URL + utils.convertStringToUrlFriendly(req.body.title)

    post.save(function (err, currentPost) {
      if (err) {
        //remove the uploaded file if there was error
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate title
          res.status(422)
          return res.render('blog/create_post', { hasErrors: true, messages: [{msg: 'Post title already exists!'}], csrfToken: req.csrfToken()});
        }
        // Some other error
        res.status(422)
        return res.render('blog/create_post', { hasErrors: true, messages: [{msg: err.errmsg}], csrfToken: req.csrfToken()});
      }
      
      res.redirect('/blog');

    }); 

});

module.exports = router;
