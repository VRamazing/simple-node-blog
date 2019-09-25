var express = require('express');
var csurf = require('csurf');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var csrfProtection = csurf();

router.use(csrfProtection);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login', style: 'login.css', script: 'login.js' });
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('signup', { title: 'signup', style: 'login.css', script: 'login.js' , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

router.get('/profile', function(req, res, next){
  res.render('user/profile');
})


module.exports = router;
