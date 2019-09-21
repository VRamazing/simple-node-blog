var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/blog/posts/')
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Express' , style: 'timeline.css'});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' , style: 'blog-home.css'});
});



module.exports = router;
