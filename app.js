var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    passport = require('passport'),
    passportConf = require('./config/passport'),
    secrets = require('./config/secrets'),
    path = require('path');

var app = express();

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

//routes
app.get('*', function(req, res){
  res.render('home');
})
app.get('/', userController.getLogin);
app.post('/', userController.postLogin);

app.post('/api/users', userController.getUsers);
app.post('/addUser', userController.postSignUp);

app.get('/logout', userController.getLogout);
//


//listen
var port = Number(process.env.PORT || 3000);
app.listen(port, function(){
  console.log("Server connected");
});
