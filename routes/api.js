var vnd_hmh_api_key = 'YOUR_Vnd-HMH-Api-Key';

var express = require('express');
var passport = require('passport');
var request = require('request');
var refresh = require('passport-oauth2-refresh');
var router = express.Router();


router.get('/', function(req, res, next) {
  if (req.user){
    res.render('users', {user: req.user});
  }else{
    res.send("sign in first.");
  }
});

router.get('/schools', function(req, res, next) { // call to HMH api
  if (req.user){

    // prepare request
    var retries = 2;
    var makeRequest = function(){
      retries--;
      if(!retries){
        return sendErrorResponse();
      }
      var requestPath;
      if (req.user.roles.indexOf('Instructor') != -1){
        requestPath = 'http://ec2-54-144-153-235.compute-1.amazonaws.com/v2/staff/' + req.user.id + '/school';
      }else{
        requestPath = 'http://sandbox.api.hmhco.com/v2/students/' + req.user.id + '/school';
      }

      var options = {
        url: requestPath,
        headers: {
          "Vnd-HMH-Api-Key": vnd_hmh_api_key,
          "Authorization": req.user.accessToken,
          "Accept": "application/json"
        }
      }

      // send request
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          res.render('school', {school: data.school, body: body});
        }else{
          if (response.statusCode == 401){
            // unauthorized, try refresh and go.
            refresh.requestNewAccessToken('oauth2', req.user.refreshToken, function(err, accessToken) {
              if(err || !accessToken) { sendErrorResponse(); }

              req.user.accessToken = accessToken;
              makeRequest();
            });
          }else{
            res.send("error fetching schools for " + req.user.username + "  ::  " + response.statusCode);
          }
        }
      });
    };

    makeRequest();

  }else{
    res.send("sign in first.");
  }
});

function send401Response() {
  return res.status(401).end();
};

module.exports = router;
