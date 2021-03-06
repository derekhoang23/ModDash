const User = require('../db/queries').User;

const getGeolocation = (req, res) => {
  return User.getUserInfo(req.userId)
    .then((data) => { res.send(data.dataValues); })
    .catch((err) => { res.sendStatus(404); });
};

const updateGeolocation = (req, res) => {
  return User.updateUserGeolocation(req.userId, req.body.geolocation)
    .then((result) => { res.sendStatus(200); })
    .catch((err) => { res.sendStatus(404); });
};

const getTransitMode = (req, res) => {
  console.log('am i getting here', req.userId);
  return User.getUserInfo(req.userId)
    .then((data) => { res.send(data.dataValues)} )
    .catch((err) => { res.sendStatus(404); });
};



const updateTransitMode = (req, res) => User.updateUserTransitMode(req.userId, req.body.transit);

module.exports = {
  getGeolocation,
  updateGeolocation,
  getTransitMode,
  updateTransitMode
};
