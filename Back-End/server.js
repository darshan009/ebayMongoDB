var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose     = require('mongoose'),
    session      = require('express-session'),
    MongoStore   = require('connect-mongo')(session),
    secrets      = require('./config/secrets'),
    path         = require('path'),
    amqp         = require('amqp'),
    util         = require('util');

var app = express();

//require controllers
var userController = require('./controllers/user'),
    passportController = require('./controllers/passport');

//mongoose connection
mongoose.connect(secrets.mongodburl);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once('open', function callback(){
  console.log("Mongoose connected to mongolab");
});

//cookieParser
app.use(cookieParser());

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on queue");

  cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			userController.postSignUp(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in postSignUp backend queue calling-----");
        console.log(res);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

  cnn.queue('passport_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      passportController.findUserAndAuthenticate(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in findUserAndAuthenticate backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });


  cnn.queue('deserializeUser_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      passportController.deserializeUser(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in deserializeUser_queue backend queue calling-----");
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('lastLoginTime_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.lastLoginTime(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in lastLoginTime_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('userLogs_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.userLogs(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in userLogs_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('advertisement_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      console.log("-----------in subscrib --------------------------------");
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.postPublishAd(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in postPublishAd backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('allAdvertisement_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.allAdvertisement(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in allAdvertisement_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('allSellingAdvertisement_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.allSellingAdvertisement(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in allSellingAdvertisement_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('getAdvertisementDetail_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.getAdvertisementDetail(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in getAdvertisementDetail_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('addToCart_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.addToCart(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in addToCart_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('checkout_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.checkout(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in checkout_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('soldItems_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.soldItems(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in soldItems_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('purchasedItems_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.purchasedItems(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in purchasedItems_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

  cnn.queue('placeBid_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      util.log(util.format( deliveryInfo.routingKey, message));
      util.log("Message: "+JSON.stringify(message));
      util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
      userController.placeBid(message, function(err,res){
        if(err)
          console.log(err);
        console.log("------in placeBid_queue backend queue calling-----");
        console.log(res);
        //return index sent
        cnn.publish(m.replyTo, res, {
          contentType:'application/json',
          contentEncoding:'utf-8',
          correlationId:m.correlationId
        });
      });
    });
  });

});
