var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// User Authentication imports
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { passportAuthentication, serialize, deserialize } = require("./middlewares/passport")

// Flash messages
const flash = require("connect-flash")



var indexRouter = require('./routes/index'); 
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var postRouter =  require('./routes/post');

// import models
const Post = require('./models/post')
const Comment = require('./models/comment')

var app = express();

passport.use(passportAuthentication)
passport.serializeUser(serialize)
passport.deserializeUser(deserialize)

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://jaypatel:Jay@1234@cluster0.51230.mongodb.net/blog_api_project_database1?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useFindAndModify', false);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Express session
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Connect flash
app.use(flash())

// Global Error/success variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg")
  res.locals.errorMsg = req.flash("errorMsg")
  res.locals.msg = req.flash("error")
  res.locals.user = req.user
  next();
})


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
