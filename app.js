var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
// var MemoryStore = require('session-memory-store')(session);
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test')

//mongoDB
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ethnosgw');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var dbClient=null;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

require('./config/passport')(passport); // pass passport for configuration

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//bootstrap jquery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


app.use(session({secret: 'glow'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// mongodb
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use(router);

app.use('/', routes);
app.use('/users', users);

//Routes
require('./login/routes')(app, passport);
require('./upload/routes')(app);
require('./pages/routes')(app); //NOTE: This needs to be last


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
