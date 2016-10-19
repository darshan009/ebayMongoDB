var passport = require('passport'),
    User = require('../models/User');

/*
 |-----------------------------------------------------------
 | LOGIN LOGOUT
 |-----------------------------------------------------------
*/

exports.postLogin = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if (err)
        return next(err);
      if(!user)
        res.send(false);
      req.logIn(user, function(err){
        if(err)
          return next(err);
        console.log(user);
        res.send(user);
      });
    })(req, res, next);
};

exports.getLogout = function(req, res){
  req.logout();
  res.send(true);
};

//get all users
exports.getUsers = function(req, res, next){
  User.find().exec(function(err, users){
    if(err) return next(err);
    // res.render('userList', {users: users});
    res.send(users);
  });
};


//signup
exports.getSignUp = function(req, res, next){
  res.send(true);
};

exports.postSignUp = function(req,res){
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        contactNo: req.body.contactNo,
        address: req.body.address,
        location: req.body.location
    });
    user.save(function(err) {
      if (!err) {
        console.log("user signup successfull");
      }
      // else if(err.code === 11000)
      // {
      //     error = "Provided email already exists..! try another.";
      //     res.send(false);
      // }
      // else {
      //     error = "Unable to save register.. Try again";
      //     res.send(false);
      // }
    });
    console.log(user);
    res.send(user);
};

exports.deleteUser = function(req, res) {
  res.send("deleting");
};
