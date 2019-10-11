var express = require('express');

exports.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/users/signup');
}
  
exports.isNotLoggedIn =function(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}