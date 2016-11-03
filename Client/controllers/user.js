var mq_client = require('../rpc/client'),
    passport = require('passport'),
    lastLoginTime;

/*
 |-----------------------------------------------------------
 | LOGIN LOGOUT
 |-----------------------------------------------------------
*/

exports.postLogin = function(req, res, next){
  //rabbitmq message call
  var user = {
    email: req.body.email
  }
  mq_client.make_request('getUser_queue', user, function(err, results){
    console.log("in getUser_queue "+results);
    if(err)
      throw err;

    //passport section only if user found
    if(results)
      passport.authenticate('local', function(err, user, info){
        if (err)
          return next(err);
        if(!user)
          res.send(user);
          console.log("--------------in poassssport authenticate------------");
        console.log(user);
        req.logIn(user, function(err){
          if(err)
            return next(err);
          req.session.lastLoginTime = user.lastLoginTime;

          //make a rpc call to save user details
          var lastLoginTimeDetails = {
              userId: user._id
            }
          mq_client.make_request('lastLoginTime_queue', lastLoginTimeDetails, function(err, results){
            if(err)
              throw err;
          });

          //create users session shoppingCart
          req.session.shoppingCart = [];
          res.send(user);
        });
      })(req, res, next);
    else {
      res.send(false);
    }

  });
};

//signup
exports.postSignUp = function(req,res){
    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        contactNo: req.body.contactNo,
        location: req.body.address
    };

    //rabbitmq message call
    mq_client.make_request('getUser_queue', user, function(err, results){
      console.log("in getUser_queue "+results);
      if(err)
        throw err;
      if(results)
        res.send(false);
      else {
        //rabbitmq message call
        mq_client.make_request('signup_queue', user, function(err, results){
          console.log("in signup_queue "+results);
          if(err)
            throw err;
        });
        res.send(user);
      }
    });
};

exports.verifyEmail = function(req, res){
  //rabbitmq message call
  mq_client.make_request('verifyEmail_queue', user, function(err, results){
    console.log("in verifyEmail_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });
};

exports.getLogout = function(req, res){
  req.session.destroy(function(err){
    res.send("success");
  });
};

exports.deleteUser = function(req, res) {
  res.send("deleting");
};

exports.getCurrentUser = function(req, res){
  var userDetails = req.user;
  userDetails = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    username: req.user.username,
    email: req.user.email,
    password: req.user.password,
    birthday: req.user.birthday,
    contactNo: req.user.contactNo,
    address: req.user.address,
    location: req.user.location,
    lastLoginDateTime: req.session.lastLoginTime
  }
  res.send(userDetails);
};


/*
 |-----------------------------------------------------------
 | check if user is logged in
 |-----------------------------------------------------------
*/
exports.isLoggedInAngular = function(req, res, next) {
  if(req.user)
    res.send(true);
  else
    res.send(false);
};

exports.isLoggedIn = function(req, res, next) {
  console.log("--------------------in isLoggedIn-------------");
  console.log(req.user);
  if(req.user)
    return next();
  else
    res.send(false);
};



/*
 |-----------------------------------------------------------
 | Publishng a new advertisement
 |-----------------------------------------------------------
*/

exports.postPublishAd = function(req, res){
  console.log("-----in postPublishAd Client -------");
  console.log(req.user._id);
  var advertisement = {
      name : req.body.name,
      specification : req.body.specification,
      quantity : req.body.quantity,
      shipping : req.body.shipping,
      price : req.body.price,
      status : "live",
      userId : req.user._id,
      biddingStatus : req.body.biddingStatus,
      biddingStartTime: Date.now()
    };

  //rabbitmq message call
  mq_client.make_request('advertisement_queue', advertisement, function(err, results){
    console.log("in advertisement_queue "+results);
    if(err)
      throw err;
    res.send(results.code);
  });

};

exports.allAdvertisement = function(req, res) {
  console.log("in allAdvertisement client side "+ req.user._id);
  var user = {
    userId: req.user._id
  };

  //rabbitmq message call
  mq_client.make_request('allAdvertisement_queue', user, function(err, results){
    console.log("in allAdvertisement_queue "+results);
    if(err)
      throw err;
    res.send(results.allAdvertisement);
  });

};


/*
 |-----------------------------------------------------------
 | All advertisements for selling
 |-----------------------------------------------------------
*/

exports.allSellingAdvertisement = function(req, res){
  var user = {
        userId: req.user._id
      }

    //rabbitmq message call
    mq_client.make_request('allSellingAdvertisement_queue', user, function(err, results){
      console.log("in allSellingAdvertisement_queue "+results);
      if(err)
        throw err;
      res.send(results);
    });
};

exports.getAdvertisementDetail = function(req, res){
  console.log("-----------------in getAdvertisementDetail-----------");
  var ad = {
    adId: req.params.adId
  }
  //rabbitmq message call
  mq_client.make_request('getAdvertisementDetail_queue', ad, function(err, results){
    console.log("in getAdvertisementDetail_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });

};


/*
 |-----------------------------------------------------------
 | Shopping cart
 |-----------------------------------------------------------
*/

exports.addToCart = function(req, res) {

  var ad = {
    adId: req.body.adId,
    quantityEntered: req.body.quantityEntered
  }
  //rabbitmq message call
  mq_client.make_request('addToCart_queue', ad, function(err, results){
    console.log("in addToCart_queue "+results);
    if(err)
      throw err;
    req.session.shoppingCart.push(results);
    res.send(results);
  });

};


exports.shoppingCart = function(req, res) {
  console.log(req.session);
  res.send(req.session.shoppingCart);
};


exports.removeFromCart = function(req, res) {
  console.log("in removeFromCart");
  console.log(req.body.adId);
  for(var i=0; i<req.session.shoppingCart.length; i++)
    if (req.session.shoppingCart[i].id == req.body.adId) {
      req.session.shoppingCart.splice(i, 1);
      req.session.save();
    }
  console.log(req.session);
  res.send(req.session.shoppingCart);
};


exports.checkout = function(req, res) {

  var checkout = {
    shoppingCart: req.session.shoppingCart,
    userId: req.user._id,

  }
  //rabbitmq message call
  mq_client.make_request('checkout_queue', checkout, function(err, results){
    console.log("in checkout_queue "+results);
    if(err)
      throw err;
    req.session.shoppingCart = [];
    res.send(results);
  });

};

/*
 |-----------------------------------------------------------
 | User profile purchased and sold items
 |-----------------------------------------------------------
*/

exports.purchasedItems = function(req, res) {
  var user = {
    userId: req.user._id
  };

  //rabbitmq message call
  mq_client.make_request('purchasedItems_queue', user, function(err, results){
    console.log("in purchasedItems_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });
};

exports.soldItems = function(req, res) {
  var user = {
    userId: req.user._id
  };

  //rabbitmq message call
  mq_client.make_request('soldItems_queue', user, function(err, results){
    console.log("in soldItems_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });
};



/*
 |-----------------------------------------------------------
 | User bidding
 |-----------------------------------------------------------
*/

exports.placeBid = function(req, res){

  var bid = {
    adId: req.body.adId,
    userId: req.user._id,
    quantityEntered: req.body.quantityEntered,
    biddingValue: req.body.biddingValue
  }

  //rabbitmq message call
  mq_client.make_request('placeBid_queue', bid, function(err, results){
    console.log("in placeBid_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });

};

/*
 |-----------------------------------------------------------
 | User logs
 |-----------------------------------------------------------
*/
exports.userLogs = function(req, res){
  var userLogs = {
    user: req.user._id,
    click : req.body.clickEvent,
    date : Date.now()
  };
  //rabbitmq message call
  mq_client.make_request('userLogs_queue', userLogs, function(err, results){
    console.log("in userLogs_queue "+results);
    if(err)
      throw err;
    res.send(results);
  });

};
