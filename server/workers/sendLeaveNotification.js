const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');
const agenda = require('./agenda');
const pubnub = require('./../setup/pubnub');
const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

agenda.define('send leave notification', function(job, done) {

  return UserController.getUser(job.attrs.data.userId)
  .then((user) => {
    console.log('send leave notify user', user);
    job.attrs.data.origin = user.dataValues.geolocation;
    var channel = user.dataValues.pubnubid;

    // Send notification through Pubnub
    var event = job.attrs.data;
    event.messageType = 'timeToLeave';

    pubnub.publish({
      message: event,
      channel: channel,
      sendByPost: false, // true to send via post
      storeInHistory: false // override default storage options
      // meta: { "cool": "meta" } // publish extra meta with the request
      },
      (status, response) => {
        // Handle status and response
        console.log('Map notification was created.')
      }
    );

    // after sending notification, agenda.cancel
    // agenda.cancel({"_id": job._id}, function(err, jobs) {
    //   console.log('canceled job after notification was sent', jobs);
    // })

    // Send text message via Twilio
    twilio.messages.create({
      to: '14158124699',
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Better leave now for ${event.name}! It will take ${Math.floor(event.traffic / 60000)} minutes to get to ${event.location}.`,
    }, function (err, message) {
      if (!err) {
        console.log('Twilio message successfully sent!')
      } else {
        console.log('Error sending Twilio message.\n', err);
      }
    });

    console.log('Sending notification to user to leave now for event:', event.name);

    done();
  });
});

const sendLeaveNotification = (notificationTime, eventData) => {
  console.log('Scheduling a leave notification for event ', eventData.name, ' at ',  notificationTime);
  // pubnub publish
  agenda.schedule(notificationTime, 'send leave notification', eventData);
};

module.exports = sendLeaveNotification;
