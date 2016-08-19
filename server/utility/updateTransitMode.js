const UserController = require('./../db/controllers/userController');

const updateTransitMode =  (req, res) => {
  var userId = req.userId;
  var transit = req.body.transit
  return UserController.updateUserTransitMode(userId, transit)
}

module.exports = updateTransitMode;
