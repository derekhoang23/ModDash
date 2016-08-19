const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');

const getUserGeolocation = (req, res) => {
  return UserController.getGeolocation(req.userId)
    .then((data) => { res.send(data.dataValues); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = getUserGeolocation;