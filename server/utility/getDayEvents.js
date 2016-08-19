const EventController = require('../db/controllers').EventController;
// const { EventController } = require('../db/controllers');

const getDayEvents = (req, res) => {

  // console.log('in get day events', req.session);
  // req.session.regenerate(() => {
    // req.session.something = 'something';
    // console.log('after regenerating', req.session);
  var userId = req.userId
  EventController.retrieveDayEvent(userId)
  .then(datas => {
    res.send(datas);
  });
  // })
}

module.exports = getDayEvents;
