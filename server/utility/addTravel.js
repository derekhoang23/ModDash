const TravelController = require('../db/controllers').TravelController;
const UserController = require('../db/controllers').UserController;
// const { TravelController, UserController } = require('../db/controllers');
const requestPromise = require('request-promise');

const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

const addTravel = (event) => {
  console.log('=========================== [addTravel]: event.dataValues\n', event.dataValues);

  return UserController.getUser(event.dataValues.userId)
  .then((data) => {

    var options = {
      url,
      qs: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: data.dataValues.geolocation,
        destinations: event.dataValues.location,
        mode: data.dataValues.transitmode,
        arrival_time: event.dataValues.startdatetime,
        // departure_time: 'now',
        units: 'imperial'
        // traffic_model: 'best_guess'
      }
    };

    console.log('========================= [addTravel]: options\n', options);

    // Request to Google Maps API for travel data
    return requestPromise(options);
  })
  .then(body => {
    // requestPromise is tricky because not handling response or error/status code, just body
    var body = JSON.parse(body);

    console.log('========================= [addTravel]: body', body);

    // console.log(body.rows[0].elements[0]);
    // var distance = body.rows[0].elements[0].distance;
    var duration = body.rows[0].elements[0].duration;
    var value = 0;

    if (duration && duration.value) {
      value = duration.value;
    }

    return value;
  })
  .then(value => TravelController.initiateTravel(event, (value * 1000))) // convert milliseconds to seconds
  .spread((travel, created) => travel);
};

module.exports = addTravel;
