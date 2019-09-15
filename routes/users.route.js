var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login', style: 'login.css', script: 'login.js' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'signup', style: 'login.css', script: 'login.js' });
});

module.exports = router;
