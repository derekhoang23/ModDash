const UserController = require('../db/controllers').UserController;
// const { UserController } = require('../db/controllers');

const updateGeolocation = (req, res) => {
  return UserController.updateUserGeolocation(req.userId, req.body.geolocation)
    .then((result) => { res.sendStatus(200); })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = updateGeolocation;