var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main/index', { title: 'Express' , style: 'blog-home.css'});
});

module.exports = router;
