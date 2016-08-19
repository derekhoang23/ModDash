const UserController = require('./../db/controllers/userController');

const updateTransitMode =  (req, res) => {
  console.log('request body', req.body);
  var userId = 2
  return UserController.updateTransitMode(userId, req.body)
}

module.exports = updateTransitMode;
