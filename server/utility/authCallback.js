const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');
const googleOAuth = require('../setup/googleOAuth');
const google = require('googleapis');
const plus = google.plus('v1');
const Promise = require('bluebird');
plus.people.get = Promise.promisify(plus.people.get);
var oauth2Client = googleOAuth.oauth2Client;

const authCallback = function(req, res) {
  // do oAuth with the code that comes back from google
  var code = req.query.code;
  console.log('code', code);
  oauth2Client.getToken(code, function (err, tokens) {
    if (err) {
      console.warn('error in getting Token', err);
    }
    oauth2Client.setCredentials(tokens);

    // console.log('success token', tokens);
    // after getting tokens, do a call to googlePlus API for user details, get their googleID
    plus.people.get({ userId: 'me', auth: oauth2Client })
    .then((profile) => {
      UserController.findOrCreateUser(profile, tokens)
      .spread((user, created) => {
        // console.log('user', user);
        // console.log('created', created);
        // NOTE: REDIRECT THEM TO SPLASH PAGE HERE.
        if(created) { // this is for new users
          // console.log('old session in web auth', req.session);
          // return req.session.regenerate(() => {
          //   req.session.something = 'something';
          //   req.session.googleid = profile.id;
          //   req.session.userid = user.dataValues.id;
            res.redirect('/')
          // });
        } else {
          // req.session.googleid = profile.id;
          // req.session.userid = user.dataValues.id;
          res.redirect('/')
        }
      })
    })
    .catch(err => {
      console.log('did not get users profile', err);
    })
  });
};

module.exports = authCallback;
