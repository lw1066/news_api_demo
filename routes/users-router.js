const usersRouter = require('express').Router();
const { getAllUsersController } = require('../controllers/get-all-users.controller');


usersRouter.get('/', getAllUsersController);

module.exports = usersRouter;