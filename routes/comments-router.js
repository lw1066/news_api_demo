const commentsRouter = require('express').Router();
const { deleteCommentByIdController } = require('../controllers/delete-comment-by-id.controller');


commentsRouter.delete('/:comment_id', deleteCommentByIdController);

module.exports = commentsRouter;