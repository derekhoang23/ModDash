const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');

const getUserGeolocation = (req, res) => {
  return UserController.getUserInfo(req.userId)
    .then((data) => { res.send(data.dataValues.geolocation); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = getUserGeolocation;
