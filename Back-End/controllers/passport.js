var passport = require('passport'),
    localStrategies = require('passport-local'),
    User = require('../models/User');
    mongoose     = require('mongoose');

exports.deserializeUser = function(msg, callback) {
  User.findById(msg.id, function(err, user) {
    var res = {};
    res.user = user;
    callback(null, res);
  });
};

exports.findUserAndAuthenticate = function(msg, callback){
  var res = {};
  User.findOne({email: msg.email}, function(err, user){
    console.log("passport "+user);
    if(err)
      console.log(err);
    if(!user)
      callback(null, false);
    if(user)
      user.comparePassword(msg.password, function(err, isMatch){
        console.log(isMatch);
        if(isMatch)
          res.user = user;
        else
          res.user = null;
        callback(null, res);
      });
  });
};
