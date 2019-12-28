const mongoose  = require("mongoose");
const express = require('express');
const constants = require('../utils/constants');
const router = express.Router();

/* GET home page. */
router.use('/', function(req,res,next){
  res.locals.currentUrl = constants.PROJECTS;
  next();
})

router.get('/', function(req, res, next) {
    res.render('portfolio/projects/projects')
})

router.get('/new', function(req, res, next) {
  res.render('portfolio/projects/new_project')
})

router.get('/:projectSlug', function(req, res, next) {
    res.render('portfolio/projects/project_detail')
})



module.exports = router;
