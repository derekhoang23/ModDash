const googleCal = require('./googleCal');

const removeEvent = (userId, eventId) => {
  return googleAuth.getUserTokens(userId)
  .then(oauth2Client => googleCal.deleteEvent(oauth2Client, eventId))
  .then(data => Event.deleteEvent(userId, data))
  .catch((err) => {
    console.log('did not successfully delete event from gcal', err);
  });
};

module.exports = removeEvent;