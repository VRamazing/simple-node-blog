var express = require('express');
var csurf = require('csurf');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
const { check } = require('express-validator');

var csrfProtection = csurf();

router.use(csrfProtection);

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/signup');
}

// function isNotLoggedIn(req, res, next){
//   if(!req.isAuthenticated()){
//     return next();
//   }
//   res.redirect('/users/');
// }

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('signup', { title: 'signup', style: 'login.css', script: 'login.js' , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', [
  check('email', 'Invalid email').isEmail(),
  check('password', 'Invalid password').isLength({min: 4})
], passport.authenticate('local.signup', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');

  res.render('signin', { title: 'singin', style: 'login.css', script: 'login.js' , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', [
  check('email', 'Invalid email').isEmail(),
  check('password', 'Invalid password').isLength({min: 4})
], passport.authenticate('local.signin', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

router.get('/signout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/profile', isLoggedIn, function(req, res, next){
  res.render('profile');
})

module.exports = router;
