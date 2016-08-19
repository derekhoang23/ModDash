const UserController = require('./../db/controllers/userController');
const googleOAuth = require('./../setup/googleOAuth.js');
const google = require('googleapis');
const calendar = google.calendar('v3');
const EventController = require('./../db/controllers/eventController');
var oauth2Client = googleOAuth.oauth2Client;
const pubnub = require('./../setup/pubnub.js')
const Promise = require('bluebird');

calendar.events.insert = Promise.promisify(calendar.events.insert);
// function(userId, eventDetails);
const addEvent = function(req, res) {
  var userId = req.userId;

  return UserController.getUserTokens(userId)
  .then(data => { 
    const params = {calendarId: 'primary', auth: oauth2Client, resource: req.body}; 
    return calendar.events.insert(params)
    // turn this into a google calendar function module
  })
  .then(data => {
    res.send(data);
    // split pubnub functions into its own module
    pubnub.publish(
      {
        message: data,
        channel: 'eventAdded',
        sendByPost: false, // true to send via post
        storeInHistory: false, // override default storage options
        meta: {} // publish extra meta with the request
      },
      (status, response) => {
        // handle status, response
        console.log('pubnub notification "eventAdded" was sent to client');
      }
    );

    return data;     
  })
  .then(data => EventController.insertEvent(data, userId)) // make everything look like this 
  .catch(err => {
    console.warn('error in addEvent utility function', err);
  });
};

module.exports = addEvent;