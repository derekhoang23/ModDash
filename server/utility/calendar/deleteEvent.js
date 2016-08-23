const googleAuth = require('../auth/googleAuth');
const googleCal = require('./googleCal');

const removeEvent = (userId, eventId) => {
  return googleAuth.getUserTokens(userId)
  .then(oauth2Client => googleCal.deleteEvent(oauth2Client, eventId))
  .then(data => {
    res.send(data);
  })
  .catch((err) => {
    console.log('did not successfully delete event from gcal', err);
  });
};

module.exports = removeEvent;
