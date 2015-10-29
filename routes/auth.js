var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/hmh', passport.authenticate('oauth2'));

router.get('/hmh/callback',
  passport.authenticate('oauth2',
    { successRedirect: '/users',
      failureRedirect: '/',
      failureFlash: true
    }
  )
);

module.exports = router;
