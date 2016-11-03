# Durins Door
A sample node express application that interacts with OpenId Connect and shows how to use HMH's public apis

## Configure and Run
```
git clone git@github.com:hmhco/durinsdoor.git
cd durinsdoor
npm install
```
## Get your client ID and secret from the developer portal

https://developer.hmhco.com

For use with the sample app you will want to create an application with a localhost redirect uri.

## Configure
These env specific values are dynamically replaced during deployment (see jenkins config)

### Configure app.js
In the app's root directory, locate a file named `app.js` and set `client_id`, `client_secret` and `oidc_base_url` at the top of the file.

### Configure api.js
In {app_root_dir}/routes/api.js, set `vnd_hmh_api_key` and `api_base_url` at the top of the file.

## Run the app

`DEBUG=durinsdoor:server npm start`

The app will run on `localhost:3000`

## More

[Authentication Flow](auth_flow.md)
