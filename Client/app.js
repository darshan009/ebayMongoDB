var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    MongoStore   = require('connect-mongo')(session),
    passport     = require('passport'),
    passportConf = require('./config/passport'),
    secrets      = require('./config/secrets');

var app = express();

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

//require controllers
var userController = require('./controllers/user');

//frontend route
app.get('*', function(req, res){
  res.render('home', {
    currentUser: req.user
  });
});

//api calls
app.post('/', userController.isLoggedIn, userController.allSellingAdvertisement);
app.post('/api/login', userController.postLogin);
app.delete('/api/user/:id', userController.deleteUser);

app.post('/api/signup', userController.postSignUp);

app.post('/api/currentUser', userController.isLoggedIn, userController.getCurrentUser);
app.post('/api/addUser', userController.isLoggedIn, userController.postSignUp);
app.post('/api/logout', userController.isLoggedIn, userController.getLogout);

//verify if user is logged in
app.post('/isLoggedIn', userController.isLoggedIn);

//profile routes
app.post('/api/addAdvertisement', userController.isLoggedIn, userController.postPublishAd);
app.post('/api/allAdvertisement', userController.isLoggedIn, userController.allAdvertisement);
app.post('/api/getAdvertisementDetail/:adId', userController.isLoggedIn, userController.getAdvertisementDetail);
app.post('/api/soldItems', userController.isLoggedIn, userController.soldItems);
app.post('/api/purchasedItems', userController.isLoggedIn, userController.purchasedItems);
//
//shoppingCart
app.post('/api/shoppingCart', userController.isLoggedIn, userController.shoppingCart);
app.post('/api/addToCart', userController.isLoggedIn, userController.addToCart);
app.post('/api/removeFromCart', userController.isLoggedIn, userController.removeFromCart)
//checkout
app.post('/api/checkout', userController.isLoggedIn, userController.checkout);

//bidding
app.post('/api/placeBid', userController.isLoggedIn, userController.placeBid);

//user activity logs
app.post('/api/userLogs', userController.isLoggedIn, userController.userLogs);

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

module.exports = app;
