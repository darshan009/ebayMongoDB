var passport = require('passport'),
    User = require('../models/User'),
    UserLogs = require('../models/UserLogs'),
    Advertisement = require('../models/Advertisement'),
    jsonfile = require('jsonfile'),
    lastLoginTime;

/*
 |-----------------------------------------------------------
 | LOGIN LOGOUT
 |-----------------------------------------------------------
*/

exports.lastLoginTime = function(msg, callback){
  User.findById(msg.userId).exec(function(err, user){
    if(err)
      return done(err);
    user.lastLoginTime = Date.now();
    user.save(function(err, user){
      if(err)
        return done(err);
    });
    console.log(user);
  });
};


//signup
exports.postSignUp = function(msg, callback){

  console.log("------in postSignUp backend----");
  console.log(msg);
  console.log(callback);
  var res  = {};
  var user = new User({
    firstName: msg.firstName,
    lastName: msg.lastName,
    username: msg.username,
    email: msg.email,
    password: msg.password,
    birthday: msg.birthday,
    contactNo: msg.contactNo,
    location: msg.address
  });
  user.save(function(err) {
    if (!err) {
      console.log("user signup successfull");
      res.code = "200";
    }else {
      res.code = "404";
    }
  });
  console.log(user);
  callback(null, res);
};


exports.getLogout = function(msg, callback){
  req.logout();
  // res.send(true);
  res.redirect('/');
};

exports.deleteUser = function(msg, callback) {
  res.send("deleting");
};


/*
 |-----------------------------------------------------------
 | Publishng a new advertisement
 |-----------------------------------------------------------
*/

exports.postPublishAd = function(msg, callback){
  console.log("----in postPublishAd Server----");
  console.log(msg);
  var res = {};
  var advertisement = new Advertisement({
      name : msg.name,
      specification : msg.specification,
      quantity : msg.quantity,
      shipping : msg.shipping,
      price : msg.price,
      status : "live",
      userId : msg.userId,
      biddingStatus : msg.biddingStatus,
      biddingStartTime: Date.now()
    });

  advertisement.save(function(err, advertisement){
    if(err)
      return done(err);
    console.log(advertisement);
    res.code = "200";
    res.advertisement = advertisement;
  });
  callback(null , res);
};

exports.allAdvertisement = function(msg, callback) {
  console.log("in allAdvertisement");
  console.log(msg);
  var res = {};
  Advertisement.find({userId: msg.userId}, function(err, advertisements){
    if(err)
      return res.code = "200";
    res.allAdvertisement = advertisements;
    callback(null , res);
  });
};


/*
 |-----------------------------------------------------------
 | All advertisements for selling
 |-----------------------------------------------------------
*/
exports.allSellingAdvertisement = function(msg, callback){
  var sortedAdvertisement = [];
  Advertisement.find().exec(function(err, advertisements){
    console.log("------in allSellingAdvertisement----");
    for(var i=0; i<advertisements.length; i++) {
      if((advertisements[i].userId).toString() != (msg.userId).toString() && advertisements[i].status == true) {
        sortedAdvertisement.push(advertisements[i]);
      }
    }
    console.log(sortedAdvertisement);
    callback(null , sortedAdvertisement);
  });
};

exports.getAdvertisementDetail = function(msg, callback){
  console.log("------in getAdvertisementDetail-------------------");
  Advertisement.findById(msg.adId, function(err, advertisement){
    if(err)
      return done(err);
    callback(null, advertisement);
  });
};


/*
 |-----------------------------------------------------------
 | Shopping cart
 |-----------------------------------------------------------
*/

exports.addToCart = function(msg, callback) {
  Advertisement.findById(msg.adId).exec(function(err, advertisement){
    if(err)
      return done(err);
    var fullCart = {
      id : advertisement._id,
      name : advertisement.name,
      specification : advertisement.specification,
      quantity : advertisement.quantity,
      shipping : advertisement.shipping,
      price : advertisement.price,
      quantityEntered : msg.quantityEntered
    }
    console.log(fullCart);
    callback(null, fullCart);
  });
};


exports.shoppingCart = function(msg, callback) {
  console.log(req.session);
  res.send(req.session.shoppingCart);
};


exports.checkout = function(msg, callback) {
  console.log("-----------checkout-------");
  var shoppingCartId = 0, quantityEntered = 0, purchasedItems = [], soldItems = [];

  //loop through all the items in the cart
  for(var i=0; i<msg.shoppingCart.length; i++) {
    shoppingCartId = msg.shoppingCart[i].id;
    quantityEntered = parseInt(msg.shoppingCart[i].quantityEntered);
    User.findById(msg.userId).exec()
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
            callback(null, "success");
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

exports.purchasedItems = function(msg, callback) {

  User.findById(msg.userId)
    .populate('purchasedItems.adId')
    .exec()
    .then(function(user){
      if(user.purchasedItems)
        callback(null, user.purchasedItems);
      else
        callback(null, null);
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};

exports.soldItems = function(msg, callback) {

  User.findById(msg.userId)
    .populate('soldItems.adId')
    .exec()
    .then(function(user){
      if(user.soldItems)
        callback(null, user.soldItems);
      else
        callback(null, null);
    })
    .then(undefined, function(err){
      if(err)
        console.log(err);
    });
};

exports.placeBid = function(msg, callback) {

};



/*
 |-----------------------------------------------------------
 | User bidding
 |-----------------------------------------------------------
*/

exports.placeBid = function(msg, callback){
  console.log("-------------placeBid--------------------");
  console.log(msg);
  Advertisement.findById(msg.adId).exec()
    .then(function(advertisement) {
      console.log("inside advertisement");
      console.log(advertisement);
      var biddingLogs = [];
      advertisement.lastBid = {
        bidder: msg.userId,
        date: Date.now(),
        quantityEntered: msg.quantityEntered,
        biddingValue: msg.biddingValue
      }

      //biddingLogs
      if(advertisement.biddingLogs.length > 0)
        biddingLogs = advertisement.biddingLogs;
      console.log(advertisement);
      biddingLogs.push({
        bidder: msg.userId,
        date: Date.now(),
        quantityEntered: msg.quantityEntered,
        biddingValue: msg.biddingValue
      });
      advertisement.biddingLogs = [];
      advertisement.biddingLogs = biddingLogs;

      advertisement.save(function(err, advertisement){
        if(err)
          return done(err);
        console.log(advertisement);
      });
      callback(null, true);
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
//           expiryDate.setDate(advertisements[i].biddingStartTime.getDate() + 4);
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





/*
 |-----------------------------------------------------------
 | User logs
 |-----------------------------------------------------------
*/
exports.userLogs = function(msg, callback){

  //write it to the database
  var userLogs = new UserLogs({
    user: msg.user,
    click : msg.click,
    date : msg.date
  });
  userLogs.save(function(err, userLogs){
    if(err)
      console.log(err);
  });
  
  callback(null, userLogs);
};
