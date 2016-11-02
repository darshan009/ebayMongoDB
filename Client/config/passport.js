var passport = require('passport'),
    localStrategies = require('passport-local'),
    mq_client = require('../rpc/client');


passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {

  var passportDetails = {
    id: id
  }
  mq_client.make_request('deserializeUser_queue', passportDetails, function(err, results){
    if(err)
      throw err;
    done(err, results.user);
  });
});

passport.use(new localStrategies({usernameField: 'email'},function(email, password, done){

  var passportDetails = {
    "email": email,
    "password": password
  };
  //rabbitmq message call
  mq_client.make_request('passport_queue', passportDetails, function(err, results){
    if(err)
      throw err;
    if(results.user)
      return done(null, results.user);
    else {
      return done(null,false,{message: "Invalid password and email"});
    }
  });

}));
