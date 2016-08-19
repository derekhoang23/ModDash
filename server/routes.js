const path = require('path');
const router = require('express').Router();
//destructure with
//const {
// addEvent,
// addTravel} = require(./utility/index.js)
const getAllEventsFromCalendar = require('./utility/getAllEventsFromCalendar');
const addEvent = require('./utility/addEvent');
const addTravel = require('./utility/addTravel');
const getUserGeolocation = require('./utility/getUserGeoLocation');
const updateGeolocation = require('./utility/updateGeolocation');
const getDayEvents = require('./utility/getDayEvents');
const queryTraffic = require('./workers/queryTraffic');
const updateTransit = require('./utility/updateTransitMode');
const jwt = require('jsonwebtoken')

//ALL ROUTES HERE

// put this parent function elsewhere later, but for now keep it here to understand what is happening.
// first add event, then add travel, then set up queryTraffic worker
var addEventAndAddTravel = (req, res) => {

// this is a composition function
  //addEvent should not handle req or res,

  // each function should be modular and pure.
  addEvent(req, res)
  // addEvent(userId, event)
  .spread((event, created) => {
    // res.send('event was added')
    console.log('event was added, now adding travel', event.dataValues);
    return addTravel(event);
  })
  .then(travel => {
    console.log('travel was added, now scheduling queryTraffic worker');
    queryTraffic(travel);
  })
}

router.use(function(req, res, next) {
  var token = req.headers.authorization;
  if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {issuer: 'NeverMissOut'}, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token, please log-in again'})
      } else {
        console.log('decoded token object', decoded);
        req.userId = decoded.userId;
        next();
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    });
  }
})

// For testing purposes
router.get('/test', function(req, res) {
  res.sendStatus(200);
});


// Calendar Routes
router.post('/calendar/addEvent', addEventAndAddTravel);
router.get('/calendar/getDayEvents', getDayEvents);

// this endpoint is not doing anything, it was just to trigger a function to fetch all of the user's events in the calendar, but we can do this on the auth callback page or elsewhere
// router.get('/calendar/getAllEvents', getAllEventsFromCalendar);

// User Routes
router.get('/users/getGeolocation', getUserGeolocation);
router.post('/users/updateGeolocation', updateGeolocation);
router.post('/users/updateTransit', updateTransit);


module.exports = router;
