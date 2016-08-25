const googleCal = require('./googleCal');

const removeEvent = (userId, eventId) => {
  return googleCal.deleteEvent(userId, eventId)
  .then(() => {
    return console.log('successfully deleted event from');
  })
  .catch((err) => {
    console.log('did not successfully delete event from gcal', err);
  });
};

module.exports = removeEvent;