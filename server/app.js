const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db/db.js');
const session = require('express-session')
const extensionAuth = require('./utility/extensionAuth');
const GoogleAuthUrl = require('./setup/googleOAuth').url;
const authCallback = require('./utility/authCallback');

const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public/dist/')));





app.all('/*', function(req, res, next) {
  // access control allow origin has to be chrome:extension/chromeID
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  if (req.method.toLowerCase() !== "options") {
   return next();
  }
  return res.sendStatus(204);
})

//MIDDLEWARE HERE
app.use('/api', router);

// extensionAuth route
app.post('/extensionAuth', extensionAuth);

// webAuth routes
app.get('/auth', function(req, res) {
  res.redirect(GoogleAuthUrl);
});
// google redirect after auth sign in to get code for access token/refresh token
app.get('/verified', authCallback);

// app.get('/', (req, res) => {
//   // google username
//   // console.log('req in every get', req.session);
//   // if (typeof req.session.googleid !== 'undefined') {
//   //   console.log('verified login: ', req.session.googleid);
//   //   res.sendFile(path.join(__dirname + '/../client/public/dist/index.html'));
//   //   res.send({auth: true, id: req.session.googleid})
//   // }

// });

module.exports = app;
