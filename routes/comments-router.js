const commentsRouter = require('express').Router();
const { deleteCommentByIdController } = require('../controllers/delete-comment-by-id.controller');
const { patchCommentByIdController } = require('../controllers/patch-comment-by-id.controller');


commentsRouter
.route('/:comment_id')
.delete(deleteCommentByIdController)
.patch(patchCommentByIdController);

module.exports = commentsRouter;