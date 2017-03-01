# How to use the authorize flow
0. Obtain a client_id and client_secret from signing up at the  [developer portal](https://developer.hmhco.com).

1. Get `code` from authorize endpoint.

  `GET /v4/authorize`

  ###### Query Params
  ```
  response_type=code
  redirect_uri
  scope=openid
  client_id
  ```
  **Note**: you should be redirecting to this url, not curling it - this curl will return HTML.

  `curl -i 'http://sandbox.graph.hmhco.com/v4/authorize?response_type=code&redirect_uri=YOUR_CALLBACK&scope=openid&client_id=CLIENT_ID'`

  When the user completes the page they will be redirected back to the redirect_uri with a query parameter 'code' that contains the authorization code required for the token call.

2. Get SIF from authorization code

  `POST /v4/token`

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
  `curl -i -X POST 'http://sandbox.graph.hmhco.com/v4/token?grant_type=authorization_code&scope=openid&redirect_uri=YOUR_CALLBACK&client_id=CLIENT_ID&code=CODE_HERE' -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic authCode"`

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

  `POST /v4/token`

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
  `curl -i -X POST 'http://sandbox.graph.hmhco.com/v4/token?client_id=CLIENT_ID&grant_type=refresh_token&scope=openid&refresh_token=REFRESH_TOKEN' -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic authCode"`

  ###### Response Data
  ```
  access_token
  token_type
  refresh_token
  expires_in
  scope
  id_token
  ```

4. The id_token and access_token is encrypted, use the /me endpoint to get user info
  
