# Durins Door
A sample node express application that interacts with OpenId Connect and shows how to use HMH's public apis

## Configure and Run
```
git clone git@github.com:hmhco/durinsdoor.git
cd durinsdoor
npm install
```
##### Get your client ID and secret from the developer portal

https://developer.hmhco.com/admin/applications/<your application id>

For use with the sample app you will want to create an application with a localhost redirect uri.

##### Configure app.js
In the app's root directory locate a file named `app.js` and replace `'YOUR_CLIENT_ID'` and `'YOUR_CLIENT_SECRET'` at the top of the file the the values at the bottom of the application edit screen in developer.hmhco.com

##### Configure api.js
In {app_root_dir}/routes/api.js replace `YOUR_Vnd-HMH-Api-Key` at the top of the file with the key from https://developer.hmhco.com/admin/applications

##### Run the app

`DEBUG=durinsdoor:server npm start`

The app will run on `localhost:3000`

## More

[Authentication Flow](auth_flow.md)
