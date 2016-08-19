const UserController = require('./../db/controllers/userController');

const getUserTransitMode = (req, res) => {
  // TO DO: User ID hardcoded for now, but should not be. The id should be in the request.
  var userId = req.userId;

  return UserController.getUserTransitMode(userId)
    .then((data) => { console.log('huh', data) })
    .catch((err) => { res.sendStatus(404); });
};

module.exports = getUserTransitMode;
