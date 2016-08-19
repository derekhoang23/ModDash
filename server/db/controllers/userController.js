const User = require('../models').User;
// const { User } = require('../models');
const googleOAuth = require('./../../setup/googleOAuth');
var oauth2Client = googleOAuth.oauth2Client;

const findOrCreateUser = (profile, tokens) => {
  return User.findOrCreate({
    where: { googleid: profile.id },
    defaults: {
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      email: profile.emails[0].value,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token
    }
  });
};

const authUser = function(profile) {
  return User.findOne({
    where: {googleid: profile.id}
  })
}

// TO DO: This needs to be fixed so that it's just doing User.findOne and returning the refreshToken as an attribute.
const getUserTokens = function(id) {
  return User.findOne({
    where: { id: id }
  })
  .then(data => {
    oauth2Client.setCredentials({
      refresh_token: data.dataValues.refreshToken
    });

    oauth2Client.refreshAccessToken((err, tokens) => {
      // console.log('token', tokens);
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });
    });
  });
};

const getUserInfo = (id) => {

  return User.findOne({
    where: { id: id },
    attributes: ['id', 'geolocation', 'transit`mode']
  })
};

const updateUserGeolocation = (id, geolocation) => {
  return User.update(
    { geolocation: geolocation },
    { where: {id : id} })
      .then((result) => result)
      .catch((err) => err);
};

const updateUserTransitMode = (id, transit) => {
  return User.update (
    {transitmode: transit},
    {where: {id: id}}
  )
  .then((result) => {
    // need to clean this up, network is still pending on client side
    res.send(result);
  })
  .catch((err) => err);
}
//
// const getTransitMode = (id) => {
//   return User.findOne({
//     where: {id: id},
//     attributes:['id', 'transitmode']
//   })
// }
const updatePubnub = (id, pubnubid) => {
  return User.update(
    { pubnubid: pubnubid },
    { where: {id: id} })
    .catch(err => {
      console.log('failure to update pubnubid in user', err);
    })
}

const getUser = (id) => {
  return User.findOne(
    { where: { id: id } }
  );
}

module.exports = {
  findOrCreateUser,
  authUser,
  getUserTokens,
  getUserInfo,
  updateUserTransitMode,
  updateUserGeolocation,
  updatePubnub,
  getUser
};
