const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');
const googleOAuth = require('./../setup/googleOAuth');
const google = require('googleapis');
const plus = google.plus('v1');
const Promise = require('bluebird');
plus.people.get = Promise.promisify(plus.people.get);
var oauth2Client = googleOAuth.oauth2Client;
const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');

const extensionAuth = function(req, res) {
  // do oAuth with the code that comes back from google
  var token = req.body.token;
  // console.log(token); 
  oauth2Client.setCredentials(
    {access_token: token});
    // after getting tokens, do a call to googlePlus API for user details, get their googleID
  plus.people.get({ userId: 'me', auth: oauth2Client })
  .then(profile => {
    // auth the user by checking their googleId against our user table's googleID
    console.log(profile);
    UserController.authUser(profile)
    .then(user => {
      if (user) {
        // put into pubnub module
        var pubnubid = uuid.v4();
        UserController.updatePubnub(user.dataValues.id, pubnubid);
        
        var tokenOptions = {
          issuer: 'NeverMissOut'
        }
        var token = jwt.sign({userId: user.dataValues.id}, process.env.JWT_SECRET, tokenOptions);
        // jwt.sign(payload, secretOrPrivateKey, options, [callback])
        res.json({
          success: true,
          message: 'here is your token',
          token: token,
          channel: pubnubid
        });
      }
    });
  })
  .catch(err => {
    console.log('did not get users profile', err);
    res.json({
      success: false,
      message: 'please log in again'
    })
  })
};

module.exports = extensionAuth;
