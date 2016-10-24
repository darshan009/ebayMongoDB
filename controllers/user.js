var passport = require('passport'),
    User = require('../models/User'),
    Advertisement = require('../models/Advertisement'),
    lastLoginTime;

/*
 |-----------------------------------------------------------
 | LOGIN LOGOUT
 |-----------------------------------------------------------
*/

exports.postLogin = function(req, res, next){
    // var date = Date.now();
    passport.authenticate('local', function(err, user, info){
      if (err)
        return next(err);
      if(!user)
        res.send(false);
      req.logIn(user, function(err){
        if(err)
          return next(err);
        this.lastLoginTime = user.lastLoginTime;
        user.lastLoginTime = Date.now();
        user.save();
        console.log(user);

        //create users session shoppingCart
        req.session.shoppingCart = [];
        res.send(user);
      });
    })(req, res, next);
};

exports.getLogout = function(req, res){
  req.logout();
  // res.send(true);
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

exports.getCurrentUser = function(req, res){
  // console.log("in getCurrentUser");
  var userDetails = req.user;
  userDetails.lastLoginDateTime = this.lastLoginTime;
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
  console.log(req.user._id);
  var advertisement = new Advertisement({
      name : req.body.name,
      specification : req.body.specification,
      quantity : req.body.quantity,
      shipping : req.body.shipping,
      price : req.body.price,
      status : "live",
      userId : req.user._id,
      biddingStatus : req.body.biddingStatus,
      biddingStartTime: Date.now()
    });

  advertisement.save(function(err){
    if(err)
      return done(err);
  });
};

exports.allAdvertisement = function(req, res) {
  var userId = req.user._id;
  console.log("in allAdvertisement");
  Advertisement.find({userId: userId}, function(err, advertisements){
    console.log(advertisements);
    res.send(advertisements);
  });
};



exports.allSellingAdvertisement = function(req, res){
  var userId = req.user._id,
      sortedAdvertisement = [];
  Advertisement.find().exec(function(err, advertisements){
    console.log("------in allSellingAdvertisement----");
    for(var i=0; i<advertisements.length; i++) {
      if(advertisements[i].userId != userId) {
        sortedAdvertisement.push(advertisements[i]);
      }
    }
    console.log(sortedAdvertisement);
    res.send(sortedAdvertisement);
  });
};

exports.getAdvertisementDetail = function(req, res){
  console.log("in getAdvertisementDetail");
  console.log(req.params.adId);
  Advertisement.findById(req.params.adId, function(err, advertisement){
    console.log(advertisement);
    res.send(advertisement);
  });
};


/*
 |-----------------------------------------------------------
 | Shopping cart
 |-----------------------------------------------------------
*/

exports.addToCart = function(req, res) {
  Advertisement.findById(req.body.adId).exec(function(err, advertisement){
    if(err)
      return done(err);
    var fullCart = {
      id : advertisement._id,
      name : advertisement.name,
      specification : advertisement.specification,
      quantity : advertisement.quantity,
      shipping : advertisement.shipping,
      price : advertisement.price,
      quantityEntered : req.body.quantityEntered
    }
    console.log(fullCart);
    req.session.shoppingCart.push(fullCart);
    res.send(fullCart);
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

exports.placeBid = function(req, res) {
  User.findById(req.user._id).exec(function(err, user){
    user.bids.push({
      adId: req.body.adId,
      quantityEntered : req.body.quantityEntered,
      biddingValue : req.body.biddingValue
    });
    user.save(function(err, user){
      if(err)
        return done(err);
    });
    console.log(user);
    res.send(true);
  });
};



exports.checkout = function(req, res) {
  console.log("-----------checkout-------");
  console.log(req.session.shoppingCart);
  var shoppingCartId = 0, quantityEntered = 0, purchasedItems = [], soldItems = [];

  //loop through all the items in the cart
  for(var i=0; i<req.session.shoppingCart.length; i++) {
    shoppingCartId = req.session.shoppingCart[i].id;
    quantityEntered = parseInt(req.session.shoppingCart[i].quantityEntered);
    User.findById(req.user._id).exec()
      .then(function(user){
        //push advertisement into purchased list of user
        if(user.purchasedItems.length > 0)
          purchasedItems = user.purchasedItems;
        purchasedItems.push({
          adId: shoppingCartId,
          quantityEntered: parseInt(quantityEntered)
        });
        user.purchasedItems = [];
        user.purchasedItems = purchasedItems;
        user.save(function(err, user){
          if(err)
            console.log(err);
        });
        return [user];
      })
      .then(function(result){
        console.log("-------advertisement------");
        console.log(result);
        return Advertisement.findById(shoppingCartId)
          .exec()
          .then(function(advertisement){
            //reflect the quantity in the advertisement
            var user = result[0];
            advertisement.quantity -= quantityEntered;
            if(advertisement.quantity == 0)
              advertisement.status = false;
            advertisement.save(function(err, advertisement){
              if(err)
                return err;
            });
            result.push(advertisement);
            console.log(result);
            return result;
          })
      })
      .then(function(result){
        console.log("-------user------");
        console.log(result);

        var advertisement = result[1],
            user = result[0];
        return User.findById(advertisement.userId).exec()
          .then(function(seller){
            //push items as sold in sellers account
            if(seller.soldItems.length > 0)
              soldItems = seller.soldItems;
            soldItems.push({
              adId: shoppingCartId,
              quantityEntered: parseInt(quantityEntered)
            });
            seller.soldItems = [];
            seller.soldItems = soldItems;
            seller.save(function(err, seller){
              if(err)
                return err;
            });
            console.log("-------user------");
            console.log(user);
            console.log("-------seller-----");
            console.log(seller);

            //clear all the items from shoppingCart
            req.session.shoppingCart = [];
          });
      })
      .then(undefined, function(err){
        if(err)
          console.log(err);
      });
  }
};


/*
 |-----------------------------------------------------------
 | User profile purchased and sold items
 |-----------------------------------------------------------
*/

exports.purchasedItems = function(req, res) {
  var userId = req.user.userId;
  console.log("in purchasedItems");
  User.findById(req.user._id)
    .populate('purchasedItems.adId')
    .exec()
    .then(function(user){
      console.log(user);
      res.send(user.purchasedItems);
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};

exports.soldItems = function(req, res) {
  var userId = req.user.userId;
  console.log("in soldItems");
  User.findById(req.user._id)
    .populate('soldItems.adId')
    .exec()
    .then(function(user){
      res.send(user.soldItems);
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};


/*
 |-----------------------------------------------------------
 | User bidding
 |-----------------------------------------------------------
*/

exports.placeBid = function(req, res){
  Advertisement.findById(req.body.adId).exec()
    .then(function(advertisement) {
      advertisement.lastBid = {
        bidder: req.user._id,
        quantityEntered: req.body.quantityEntered,
        biddingValue: req.body.biddingValue
      }
      advertisement.save(function(err, advertisement){
        if(err)
          return done(err);
      });
      console.log(advertisement);
      res.send(advertisement);
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};

function biddingTimeExpired() {
  var adId = req.params.adId;
  Advertisement.findById(adId).exec()
    .then(function(advertisement) {
      advertisement.biddingStartTime = null;
      advertisement.biddingStatus = false;
      advertisement.quantity -= advertisement.lastBid.quantityEntered;
      if(advertisement.quantity == 0)
        advertisement.status = false;
      advertisement.save(function(err, advertisement){
        if(err)
          return err;
      });
      return [advertisement];
    })
    .then(function(result){
      var advertisement = result[0], soldItems = [];
      return User.findById(advertisement.userId).exec()
        .then(function(seller){
          if(seller.soldItems.length > 0)
            soldItems = seller.soldItems;
          soldItems.push({
            adId: advertisement._id,
            quantityEntered: advertisement.lastBid.quantityEntered
          });
          seller.soldItems = [];
          seller.soldItems = soldItems;
          seller.save(function(err, seller){
            if(err)
              return err;
          });
          return [advertisement, seller];
        })//seller
    })
    .then(function(result){
      var advertisement = result[0],
          seller = result[1],
          purchasedItems = [];
      return User.findById(advertisement.lastBid.bidder).exec()
        .then(function(buyer){
          if(buyer.purchasedItems.length > 0)
            purchasedItems = buyer.purchasedItems;
          purchasedItems.push({
            adId: advertisement._id,
            quantityEntered: advertisement.lastBid.quantityEntered
          });
          buyer.purchasedItems = [];
          buyer.purchasedItems = purchasedItems;
          buyer.save(function(err, buyer){
            if(err)
              console.log(err);
          });
          result.push(buyer);
          console.log(result);
          res.send(result);
        })//buyer
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};

//repeated executing function
// (function bidTimer() {
//   var expiryDate = new Date();
//   Advertisement.find()
//     .exec(function(err, advertisements){
//       if(err)
//         console.log(err);
//       for(var i=0; i<advertisements.length; i++){
//         if(advertisements[i].biddingStartTime) {
//           expiryDate.setDate(advertisements[i].biddingStartTime.getDate() + 2);
//           if(expiryDate < advertisements[i].biddingStartTime)
//             biddingTimeExpired(advertisements[i]._id);
//         }
//       }
//       console.log("bidtimer");
//
//       //repeat this function again
//       setTimeout(bidTimer(), 50000000);
//     });
// })();
