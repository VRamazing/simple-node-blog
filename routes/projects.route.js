const mongoose  = require("mongoose");
const express = require('express');
const constants = require('../utils/constants');
const router = express.Router();

var data = [
  {   
      title: "Clash Tracks",
      description: "An top down obstacle racer made in js",
      usp: "",
      technologyUsed: "javascript, css, html5",
      category: "web application",
      thumbnail: "https://assets.vg247.com/current//2018/04/synthetik_screen_capture_9.jpg",
      liveLink: "http://www.vigneshramesh.in",
      detailLink: 'portfolio/projects/clash-tracks',
      dateStarted: '12-10-2019',
      dateCompleted: '12-10-2019'
  },
  {   
      title: "Clash Tracks",
      description: "An top down obstacle racer made in js",
      usp: "",
      technologyUsed: "javascript, css, html5",
      category: "web application",
      thumbnail: "https://assets.vg247.com/current//2018/04/synthetik_screen_capture_9.jpg",
      liveLink: "http://www.vigneshramesh.in",
      detailLink: 'portfolio/projects/clash-tracks',
      dateStarted: '12-10-2019',
      dateCompleted: '12-10-2019'
  },
  {   
      title: "Clash Tracks",
      description: "An top down obstacle racer made in js",
      usp: "",
      technologyUsed: "javascript, css, html5",
      category: "web application",
      thumbnail: "https://assets.vg247.com/current//2018/04/synthetik_screen_capture_9.jpg",
      liveLink: "http://www.vigneshramesh.in",
      detailLink: 'portfolio/projects/clash-tracks',
      dateStarted: '12-10-2019',
      dateCompleted: '12-10-2019'
  }
]


/* GET home page. */
router.use('/', function(req,res,next){
  res.locals.currentUrl = constants.PROJECTS;
  next();
})

router.get('/', function(req, res, next) {
    //Projects added based on pagination
    res.render('portfolio/projects/projects', {projects: data})
})

router.get('/new', function(req, res, next) {
  res.render('portfolio/projects/new_project')
})

router.get('/:projectSlug', function(req, res, next) {
    res.render('portfolio/projects/project_detail')
})



module.exports = router;
