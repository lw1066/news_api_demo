const apiRouter = require('express').Router();
const topicsRouter = require('./topic-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');
const { getApiMapController } = require('../controllers/get-api-map.controller');

apiRouter.get('/api', getApiMapController);
apiRouter.use('/api/topics', topicsRouter);
apiRouter.use('/api/articles', articlesRouter);
apiRouter.use('/api/comments', commentsRouter);
apiRouter.use('/api/users', usersRouter);


module.exports = apiRouter;
