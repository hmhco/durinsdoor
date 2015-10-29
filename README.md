# Durins Door
A sample node express application that interacts with OpenId Connect and shows how to use HMH's public apis

# Configure and Run
## Get your client ids/secrets from the developer portal

- https://developer.hmhco.com

## Configure app.js
In the app's root directory locate a file named `app.js` and replace `'YOUR_CLIENT_ID'` and `'YOUR_CLIENT_SECRET'` at the top of the file.

# How to run the application

```
git clone git@github.com:hmhco/durinsdoor.git
cd durinsdoor
npm install
DEBUG=durinsdoor:server npm start
```

The app will run on localhost:3000

# More

(link to auth_flow.md)
