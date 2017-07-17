# How to use the authorize flow
**Prerequisite**: Obtain a `client_id`, `client_secret` and `user_key` by signing up and registering your application at the [developer portal](https://developer.hmhco.com).

1. Get 'authorization code' from authorize endpoint.

  `GET /v4/authorize`

  ###### Query Params
  ```
  response_type=code
  redirect_uri
  scope=openid
  client_id
  ```
  **Note**: This is a 'Sign In' page, and your application should redirect the user to this url.

  `http://sandbox.graph.hmhco.com/v4/authorize?response_type=code&scope=openid&redirect_uri=<YOUR_CALLBACK>&client_id=<CLIENT_ID>`

  When the user completes the page they will be redirected back to the redirect_uri with a query parameter 'code' that contains the authorization code required for the token call.

2. Get SIF access token from authorization code

  `POST /v4/token`

  ###### Headers
  ```
  "Authorization: Basic <AUTH>"
  ```
  **Note**: `<AUTH>` is a Base64 encoded string in the following format; `'<CLIENT_ID>:<CLIENT_SECRET>'`

  ```
  example:
  CLIENT_ID = 12345-abcd-4004-bea1-421e284a321b.hmhco.com
  CLIENT_SECRET = Hu33njfkdTusfn_3eHjkhfs92rhsjkv'
  AUTH = Base64('12345-abcd-4004-bea1-421e284a321b.hmhco.com:Hu33njfkdTusfn_3eHjkhfs92rhsjkv') = 'MTIzNDUtYWJjZC00MDA0LWJlYTEtNDIxZTI4NGEzMjFiLmhtaGNvLmNvbTpIdTMzbmpma2RUdXNmbl8zZUhqa2hmczkycmhzamt2'
  ```

  ``` javascript
  // javascript example
  var auth = new Buffer(client_id + ':' + client_secret).toString('base64');
  ```

  ###### Query Params
  ```
  redirect_uri
  client_id
  grant_type=authorization_code
  scope=openid
  code
  ```
  `curl -iX POST 'http://sandbox.graph.hmhco.com/v4/token?grant_type=authorization_code&scope=openid&redirect_uri=<YOUR_CALLBACK>&client_id=<CLIENT_ID>&code=<AUTHORIZATION_CODE>' -H "Authorization: Basic <AUTH>"`

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
  "Authorization: Basic <AUTH>"
  ```
  ###### Query Params
  ```
  client_id
  refresh_token
  scope=openid
  grant_type=refresh_token
  ```
  `curl -iX POST 'http://sandbox.graph.hmhco.com/v4/token?client_id=<CLIENT_ID>&grant_type=refresh_token&scope=openid&refresh_token=<REFRESH_TOKEN>' -H "Authorization: Basic <AUTH>"`

  ###### Response Data
  ```
  access_token
  token_type
  refresh_token
  expires_in
  scope
  id_token
  ```

4. The id_token and access_token is encrypted. To get user info, use the `/me` endpoint.

  `curl -X GET -H "Authorization: SIF_HMACSHA256 <SIF_ACCESS_TOKEN>" -H "Vnd-HMH-Api-Key: <USER_KEY>" "http://sandbox.graph.hmhco.com/v4/me"`


### API Endpoints
#### Sandbox
All API requests use the same base URL;

    http://sandbox.graph.hmhco.com/<version>
    ex. http://sandbox.graph.hmhco.com/v4/students?page[number]=3&page[size]=5

This applies to the OIDC endpoints as well;

    ex.
    http://sandbox.graph.hmhco.com/v4/authorize
    http://sandbox.graph.hmhco.com/v4/token