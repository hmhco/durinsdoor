var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.user){
    res.render('users', {user: req.user});
  }else{
    res.send("sign in first.");
  }
});

module.exports = router;
