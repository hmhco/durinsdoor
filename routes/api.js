// These env specific variables are dynamically replaced during deployment (see jenkins config)
var vnd_hmh_api_key = 'e264dedf0978e02f79305a1df79c7006';
var api_base_url = 'http://int.graph.hmhco.com/v1';
// ---

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

router.get('/me', function(req, res, next) { // call to HMH api
  if (req.user){

    // prepare request
    var retries = 2;
    var makeRequest = function(){
      retries--;
      if(!retries){
        return sendErrorResponse();
      }
      var requestPath = api_base_url + '/me';
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
          var resp = JSON.parse(body);
          var data = JSON.stringify(resp.data, null, 2)
          res.render('me', {data: data});
        }else{
          if (response.statusCode == 401){
            // unauthorized, try refresh and go.
            refresh.requestNewAccessToken('oauth2', req.user.refreshToken, function(err, accessToken) {
              if(err || !accessToken) { sendErrorResponse(); }

              req.user.accessToken = accessToken;
              makeRequest();
            });
          }else{
            res.send("error fetching data; " + response.statusCode);
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
