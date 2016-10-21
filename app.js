var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose     = require('mongoose'),
    session      = require('express-session'),
    MongoStore   = require('connect-mongo')(session),
    passport     = require('passport'),
    passportConf = require('./config/passport'),
    secrets      = require('./config/secrets'),
    path         = require('path'),
    amqp         = require('amqplib'),
    amqpConn     = null;
    // rabbit       = require('./config/rabbitmq');

var app = express();

// //rabbitmq connection
// amqp.connect('amqp://localhost', function(err, conn){});
// amqp.connect('amqp://localhost', function(err, conn){
//   if(err) console.log("Error in conncetion");
//   conn.creatChannel(function(err, ch){
//     if(err) console.log("Error in channel "+err);
//     console.log("channel connected");
//
//     var q = 'hello';
//     ch.assertQueue(q, {durable: false});
//     // Note: on Node 6 Buffer.from(msg) should be used
//     ch.sendToQueue(q, new Buffer.from('Hello World!'));
//     console.log(" [x] Sent 'Hello World!'");
//   });
// });

//mongoose connection
mongoose.connect(secrets.mongodburl);
mongoose.connection.on('error', console.error.bind(console, 'connection error'));
mongoose.connection.once('open', function callback(){
  console.log("Mongoose connected to mongolab");
});

//views, bodyparser, cookieParser, session
app.set("views",__dirname+"/public/views");
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "2hjkeydwjfhusdifsb",
  store: new MongoStore({
    url: secrets.mongodburl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.currentUser= req.user;
  next();
});

//require controllers
var userController = require('./controllers/user');

//frontend route
app.get('*', function(req, res){
  res.render('home');
});

//api calls
app.post('/', userController.allSellingAdvertisement);
app.post('/api/login', userController.postLogin);
app.delete('/api/login', userController.deleteUser);

app.post('/api/signup', userController.postSignUp);

app.post('/api/currentUser', userController.getCurrentUser);
app.post('/api/addUser', userController.postSignUp);
app.get('/logout', userController.getLogout);

//verify if user is logged in
app.post('/isLoggedIn', userController.isLoggedIn);

//profile routes
app.post('/api/addAdvertisement', userController.postPublishAd);
app.post('/api/allAdvertisement', userController.allAdvertisement);
app.post('/api/getAdvertisementDetail/:adId', userController.getAdvertisementDetail);

//shoppingCart
app.post('/api/shoppingCart', userController.shoppingCart);
app.post('/api/addToCart', userController.addToCart);
app.post('/api/removeFromCart', userController.removeFromCart)

//checkout
app.post('/api/checkout', userController.checkout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers


//listen
var port = Number(process.env.PORT || 3000);
app.listen(port, function(){
  console.log("Server connected");
});
