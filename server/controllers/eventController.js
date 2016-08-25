const Event = require('../db/queries').Event;
const addEvent = require('../utility/calendar/addEvent');
const addTravel = require('../utility/map/addTravel');
const removeEvent = require('../utility/calendar/removeEvent');
const queryTraffic = require('../workers/queryTraffic');
const google = require('googleapis');
const googleAuth = require('../utility/auth/googleAuth');
const Promise = require('bluebird');

console.log('remove event func', removeEvent);

const addEventAndAddTravel = (req, res) => {
  addEvent(req.userId, req.body)
  .spread((event, created) => {
    res.sendStatus(200);
    console.log('Event successfully added. Now adding travel.\n', event.dataValues);
    return addTravel(event);
  })
  .then(travel => {
    console.log('Travel successfully added. Now scheduling queryTraffic worker.');
    queryTraffic(travel);
  });
};

const getDayEvents = (req, res) => {
  Event.getDayEvents(req.userId)
  .then(datas => {
    res.send(datas);
  });
};

const deleteEventFromGcal = (req, res) => {
  // need to delete from travel table and from mongo
  removeEvent(req.userId, req.body.eventId)
    .then(() => {
      Event.deleteEvent(req.body.eventId);
    })
    .then(() => {
      console.log('successfulle removed event from db');
      res.sendStatus(204);
    })
    .catch(err => {
      console.log('did not delete event from db', err);
    });
};

module.exports = {
  addEventAndAddTravel,
  getDayEvents,
  deleteEventFromGcal
};