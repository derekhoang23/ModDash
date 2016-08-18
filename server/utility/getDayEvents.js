const EventController = require('./../db/controllers/eventController');


const getDayEvents = (req, res) => {
  console.log('session', req.session)
  EventController.retrieveDayEvent()
  .then(datas => {
    res.send(datas);
  });
}

module.exports = getDayEvents;
