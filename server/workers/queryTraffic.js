const Event = require('../db/queries').Event;
const agenda = require('./agenda');
const getTrafficTime = require('../utility/map/getTrafficTime');
const sendLeaveNotification = require ('./sendLeaveNotification');

const recurringCheck = (event) => {
  console.log('inside recurringCheck');
  const timeToCheckAgain = 180000; // check every 3 min
  getTrafficTime(event)
  .then(times => {
    // 15 minutes before hand
    if (Date.now() + times.traffic + 1500000 >= Date.parse(event.dataValues.startdatetime)) {
      console.log('traffic is over start time, sending notification');
      event.dataValues.traffic = times.traffic;
      sendLeaveNotification(times.notificationTime, event.dataValues);
    } else {
      console.log('traffic is not over start time, do setTimeout to make another check in 3 minutes');
      // polling is a time-sensitive way to query data
      setTimeout(function() {
        console.log('setTimeout recurringCheck triggered 3 minute later');
        recurringCheck(event);
      }, timeToCheckAgain);
    }
  });
};

// define the job
agenda.define('query traffic', (job, done) => {
  var travel = job.attrs.data;
  var eventId = travel.eventId;

  Event.retrieveEvent(eventId)
  .then(event => {
    recurringCheck(event);
  });

  setTimeout(() => {
    removeQueryTraffic(job.attrs._id);
  }, 1000);

  // then agenda.cancel({id: jobiD}) or some other kind of identifier of the job we were doing
  done();
});

// function for scheduling the job
const queryTraffic = travel => {
  travel = travel.dataValues;
  if (travel.queryTime >= Date.now()) {
    console.log('scheduling a queryTraffic worker for destination', travel.destination,'to begin querying at', travel.queryTime)
    agenda.schedule(travel.queryTime, 'query traffic', travel);
  } else {
    console.log('query time is in the past, query traffic job was not scheduled, instead just do it now');
    // need to do something to tell the user the query wasn't scheduled...
    // can send another notification to tell them that their event is in the past and provide a map to that location so they can check on their own
    agenda.now('query traffic', travel);
    // NOTE: THIS WILL BREAK WHEN THE USER FIRST LOGS IN, IT WILL SEND A TON OF NOTIFICATIONS

  }
};

const removeQueryTraffic = function(id) {
  agenda.cancel({_id: id}, (err, numRemoved) => {
    if (err) {
      console.warn('error in removing job:', err)
    } else {
      console.log(numRemoved, 'query traffic job removed');
    }
  });
};

// agenda.cancel){data: {id: travel.id}}

module.exports = queryTraffic;
