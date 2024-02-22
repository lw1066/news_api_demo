const usersRouter = require('express').Router();
const { getAllUsersController } = require('../controllers/get-all-users.controller');
const { getUserByUsernameController } = require('../controllers/get-user-by-username.controller');


usersRouter.get('/', getAllUsersController);

usersRouter.get('/:username', getUserByUsernameController);

module.exports = usersRouter;