var express = require('express');
const constants = require('../utils/constants');
const nodemailer = require('nodemailer');
var csurf = require('csurf');

const csrfProtection = csurf();

var router = express.Router();

router.use(csrfProtection);

var transporter = nodemailer.createTransport({
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWD
  },
  service: 'gmail',
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.currentUrl = constants.BLOG;
  res.redirect('/blog/posts/');
});

router.get('/about', function(req, res, next) {
  res.locals.currentUrl = constants.ABOUT;
  res.render('about', { title: 'Express' , style: ['timeline.css']});
});

router.get('/contact', function(req, res, next) {
  res.locals.currentUrl = constants.CONTACT;
  res.render('contact', { title: 'Express' , style: ['blog-home.css'], csrfToken: req.csrfToken()});
});

router.get('/sendmail/success', function(req, res, next) {
  res.render('success', {'message': 'Message has been sent', style: ['success.css']});
});

router.post('/sendmail', function(req, res, next) {
  var mailOptions = {
    from: req.body.email,
    to: "techie.vigneshramesh@gmail.com",
    subject: "vigneshramesh.in contact form -" + req.body.name,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.redirect('/sendmail/success')
    }
  });
});

module.exports = router;
