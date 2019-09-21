var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/blog/posts')
});

router.get('/posts', function(req, res, next) {
  res.render('blog/home', {});
});

router.get('/posts/:postId/:postSlug', function(req, res, next) {
  res.render('blog/post', {});
});

router.get('/posts/new', function(req, res, next) {
    res.render('blog/create_post', {});
});

module.exports = router;
