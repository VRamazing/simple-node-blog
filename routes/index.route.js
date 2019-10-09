var express = require('express');
const constants = require('../utils/constants');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.currentUrl = constants.BLOG;
  res.redirect('/blog/posts/');
});

router.get('/about', function(req, res, next) {
  res.locals.currentUrl = constants.ABOUT;
  res.render('about', { title: 'Express' , style: 'timeline.css'});
});

router.get('/contact', function(req, res, next) {
  res.locals.currentUrl = constants.CONTACT;
  res.render('contact', { title: 'Express' , style: 'blog-home.css'});
});

module.exports = router;
