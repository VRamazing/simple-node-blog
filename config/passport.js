var passport = require('passport');
var User = require('../models/user.model');
var LocalStrategy = require('passport-local').Strategy;
const { validationResult } = require('express-validator');
const constants = require('../utils/constants');

var mongoose = require('mongoose');

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){

    if(req.body.password !== req.body['confirm-password']){
        return done(null, false, {message: 'Passwords do not match.'})
    }

    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, {message: 'Email is already in use.'})
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.name = req.body.name;
        newUser.profession = req.body.profession;
        if(req.file === undefined){
            newUser.avatar = constants.USER_THUMBNAIL_URL + 'default.png';
        }
        else{
            newUser.avatar = constants.USER_THUMBNAIL_URL + req.file.filename;
        }
        newUser.save(function(err, result){
            if(err){
                return done(err);
            }
            return done(null, newUser);
        })
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    var errors = validationResult(req);
    User.findOne({'email': email}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, {message: 'Email does not exist.'})
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Wrong password.'})
        }
        return done(null, user);
    });
}));