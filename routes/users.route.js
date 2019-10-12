var express = require('express');
var csurf = require('csurf');
var router = express.Router();
var passport = require('passport');
const multer = require("multer");
const { check } = require('express-validator');
const csrfProtection = csurf();
const constants = require('../utils/constants');
const authHelper = require('../utils/authHelpers');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/users');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:|\./g,'')  + '__' + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(req.flash("error", "File type not accepted. Please upload png/jpeg"), false);
    }
}

//supports a file of 2MB for thumbnail avatar image
const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 2
}, fileFilter: fileFilter})

router.use(csrfProtection);

router.get('/profile', authHelper.isLoggedIn, function(req, res, next){
  res.locals.currentUrl = constants.PROFILE;
  var user = req.session.user;
  res.render('profile', {user: req.user});
})

router.get('/signout', authHelper.isLoggedIn, function(req, res, next){
  res.locals.currentUrl = 'SIGNOUT';
  req.logout();
  res.redirect('/');
})


router.use('/', authHelper.isNotLoggedIn, function(req,res,next){
  next();
})

router.get('/signup', function(req, res, next) {
  res.locals.currentUrl = constants.SIGNUP;
  var messages = req.flash('error');
  res.render('signup', { title: 'signup', style: ['login.css'], script: ['login.js'] , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', 
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Invalid password').isLength({min: 4})
  ],
  upload.single('avatar'),
  passport.authenticate('local.signup', 
  {
    successRedirect: '/users/profile',
    failureRedirect: '/users/signup',
    failureFlash: true
  }
));

router.get('/signin', function(req, res, next) {
  res.locals.currentUrl =  constants.SIGNIN;
  var messages = req.flash('error');
  res.render('signin', { title: 'singin', style: ['login.css'], script: ['login.js'] , csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', [
  check('email', 'Invalid email').exists().isEmail(),
  check('password', 'Invalid password').exists().isLength({min: 4})
], passport.authenticate('local.signin', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signin',
  failureFlash: true
}));

module.exports = router;
