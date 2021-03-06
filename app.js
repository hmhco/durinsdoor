// These env specific variables are dynamically replaced during deployment (see jenkins config)
var client_id = '<ID>';
var client_secret = '<SECRET>';
var api_base_url = '<URL>';
// ---

var https = require('https').globalAgent.options.rejectUnauthorized = false;
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var api = require('./routes/api');
var atob = require('atob');
var refresh = require('passport-oauth2-refresh');
var https = require('https').globalAgent.options.rejectUnauthorized = false;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: "super_secret_session key", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/api', api);

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

// passport
var OAuth2Strategy = require('passport-oauth2').Strategy;

var strategy = new OAuth2Strategy({
    authorizationURL: api_base_url + '/authorize',
    tokenURL: api_base_url + '/token',
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: '/auth/hmh/callback',
    customHeaders: {'Authorization' : 'Basic '+new Buffer(client_id + ':' + client_secret).toString('base64')},
    scope: ['openid'],
    skipUserProfile: true
  },
  function(accessToken, refreshToken, profile, done) {
    // decode sif token, set up some user info.
    var user = {};
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    done(null, user);
  }
);

strategy.tokenParams = function(options){ return {scope: 'openid'}; };

passport.use(strategy);
refresh.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = app;
