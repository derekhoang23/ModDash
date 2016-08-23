const googleAuth = require('../auth/googleAuth');
const google = require('googleapis');
var calendar = google.calendar('v3');
const Promise = require('bluebird');

calendar.events.insert = Promise.promisify(calendar.events.insert);
calendar.events.list = Promise.promisify(calendar.events.list);
// calendar.events.delete = Promise.promisify(calendar.events.delete);

const addEventToGoogleCal = (userId, eventDetails) => {
  return googleAuth.getUserTokens(userId)
  .then(oauth2Client => {
    var params = {
      calendarId: 'primary',
      auth: oauth2Client,
      resource: eventDetails
    };
    return calendar.events.insert(params);
  })
  .catch(err => {
    console.warn('error in adding event to Google Calendar:', err);
  });
};


const getEventsFromGoogleCal = (id) => {
  return googleAuth.getUserTokens(id)
  .then(oauth2Client => {
    var params = {
      auth: oauth2Client,
      calendarId: 'primary',
      singleEvents: true,
      timeMin: (new Date(Date.now() - 12096e5)).toISOString(),
      timeMax: (new Date(Date.now() + 12096e5)).toISOString()
      // 12096e5 is 2 weeks in milliseconds, so this will pull events from 2 weeks in the past and 2 weeks in the future
    };
    return calendar.events.list(params);
  })
  .catch(err => {
    console.warn('error in getting events from Google Calendar', err);
  });
};

const deleteEvent = (id, event) => {
  console.log('inside d event google cal', event);
  return googleAuth.getUserTokens(id)
  .then(oauth2Client => {
    var params = {
      auth: oauth2Client,
      calendarId: 'primary',
      eventId: event
    };
    return calendar.events.delete(params, function(res) {
      console.log('deleted event from gcal', res);
    });
  })
  .catch(err => {
    console.warn('did not delete event from google calendar', err);
  });
};

module.exports = {
  addEventToGoogleCal,
  getEventsFromGoogleCal,
  deleteEvent
};