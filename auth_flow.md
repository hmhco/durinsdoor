# How to use the authorize flow
0. Obtain a client_id and client_secret from signing up at the  [developer portal](https://developer.hmhco.com).

1. Get `code` from authorize endpoint.

  `GET /openid-connect/v2/authorize`

  ###### Query Params
  ```
  response_type=code
  redirect_uri
  scope=openid
  client_id
  ```
  **Note**: you should be redirecting to this url, not curling it - this curl will return HTML.

  `curl -i 'http://sandbox.api.hmhco.com/openid-connect/v2/authorize?response_type=code&redirect_uri=YOUR_CALLBACK&scope=openid&client_id=CLIENT_ID'`

  When the user completes the page they will be redirected back to the redirect_uri with a query parameter 'code' that contains the authorization code required for the token call.

2. Get SIF from authorization code

  `POST /openid-connect/v2/token`

  ###### Headers
  ```
  "Authorization: Basic authCode"
  "Content-Type: application/x-www-form-urlencoded"
  ```
  `authCode` is a string = 'client_id:client_secret' base64 encoded.
  ``` javascript
  // javascript example
  var authCode = new Buffer(client_id + ':' + client_secret).toString('base64');
  ```

  ###### Query Params
  ```
  redirect_uri
  client_id
  grant_type=authorization_code
  scope=openid
  code
  ```
  `curl -i -X POST 'http://sandbox.api.hmhco.com/openid-connect/v2/token?grant_type=authorization_code&scope=openid&redirect_uri=YOUR_CALLBACK&client_id=CLIENT_ID&code=CODE_HERE' -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic authCode"`

  ###### Response Data
  ```
  access_token
  token_type
  refresh_token
  expires_in
  scope
  id_token (which is the code passed to the request)
  ```
3. Refresh

  `POST /openid-connect/v2/token`

  ###### Headers
  ```
  "Authorization: Basic authCode"
  "Content-Type: application/x-www-form-urlencoded"
  ```
  ###### Query Params
  ```
  client_id
  refresh_token
  scope=openid
  grant_type=refresh_token
  ```
  `curl -i -X POST 'http://sandbox.api.hmhco.com/openid-connect/v2/token?client_id=CLIENT_ID&grant_type=refresh_token&scope=openid&refresh_token=REFRESH_TOKEN' -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic authCode"`

  ###### Response Data
  ```
  access_token
  token_type
  refresh_token
  expires_in
  scope
  ```

4. Decode access for more user info.
  - split access_token on " "
  - Base64 decode the string on the right side of the split
  - split the result of #2 on "."
  - each string from the result of #3 can be Base64 decoded.

    - the three strings are claims, jwt, signature
        - decoded claims contains: alg(algorithm), typ(type)
        - decoded jwt keys:
        ```
        iss (issuer)
        aud (audience)
        iat (issued at)
        sub
            cn (common name)
            uid (username)
            uniqueIdentifier (user's refid)
        http://www.imsglobal.org/imspurl/lis/v1/vocab/person (array, roles)
        platform id
        client_id
        exp (expire at timestamp)
        ```

  ``` javascript
  //javascript example
  function userFromSIFToken(accessToken){
    var user = {};
    var accessSplit = accessToken.split(' ');
    var schema = accessSplit[0];
    var sif = accessSplit[1];
    var decodedSif = atob(sif);
    var decodedSplit = decodedSif.split('.');
    var claims = decodedSplit[0];
    var encodedJwt = decodedSplit[1];
    var signature = decodedSplit[2];
    var decodedJwt = atob(encodedJwt);
    var jwt = JSON.parse(decodedJwt);
    var subKeyVals = jwt.sub.split(',');
    var sub = {}; // will hold cn, uid, uniqueIdentifier, o, dc
    for(var keyVal in subKeyVals){
      var split = subKeyVals[keyVal].split('=');
      sub[split[0]] = split[1];
    }
    user.name = sub.cn;
    user.username = sub.uid;
    user.id = sub.uniqueIdentifier;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.roles = jwt['http://www.imsglobal.org/imspurl/lis/v1/vocab/person'];
      return user;
  }
  ```
