const http = require('http');
const fs = require('fs');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var isUrl = require('is-url');
var isXml = require('is-xml');



var feedmap = require('./feedmap.js');
var utilities = require('./utilities.js');
var logstashconfigpath = require('./config.json')["logstashconfigpath"];


var index = require('./routes/index');
var addfeed = require('./routes/addfeed');
var getfeed = require('./routes/getfeed');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

utilities.createLogstashConfigFile(feedmap.getMap(), logstashconfigpath);

app.use('/getfeed', getfeed);
app.use('/addfeed', addfeed);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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