const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/get-all-topics.controller');

topicsRouter.get('/', getAllTopics);

module.exports = topicsRouter;