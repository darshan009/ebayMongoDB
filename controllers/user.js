var passport = require('passport'),
    User = require('../models/User');

/*
 |-----------------------------------------------------------
 | LOGIN LOGOUT
 |-----------------------------------------------------------
*/
exports.getLogin = function(req, res){
  if(req.user){
    if((req.user.type).toLowerCase() == "admin")
      res.redirect('/userList');
    else
      res.end("Your are not authorized");
  }else res.render('adminLogin');
};

exports.postLogin = function(req, res, next){
    passport.authenticate('local', function(err, user, info){
      if (err)
        return next(err);
      if(!user)
        res.redirect('/');
      req.logIn(user,function(err){
        if(err)
          return next(err);
        res.redirect('/userList');
      });
    })(req, res, next);
};

exports.getLogout = function(req, res){
  req.logout();
  res.redirect('/');
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
  res.render('signup');
};

exports.postSignUp = function(req,res){
    var user = new User({
        firstName: req.body.name,
        lastName: req.body.lastName,
        email:req.body.email,
        password:req.body.password
    });
    user.save(function(err)
    {
        var error;
        if (!err) {
          console.log("user signup successfull");
          res.redirect('/');
        }
        else if(err.code === 11000)
        {
            error = "Provided email already exists..! try another.";
        }
        else {
            error = "Unable to save register.. Try again";
        }
        res.render('signup', {error: error});
    });

};
