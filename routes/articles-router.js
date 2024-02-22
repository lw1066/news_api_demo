const articlesRouter = require('express').Router();
const { getAllArticlesController } = require('../controllers/get-all-articles.controller');
const { getAllCommentsForArticleController } = require('../controllers/get-all-comments-for-article.controller');
const { getArticleByIdController } = require('../controllers/get-article-by-id.controller');
const { patchArticleByIdController } = require('../controllers/patch-article_by_id.controller');
const { postNewCommentController } = require('../controllers/post-new-comment.controller');


articlesRouter.get('/', getAllArticlesController);
articlesRouter.get('/:article_id', getArticleByIdController);
articlesRouter.get('/:article_id/comments', getAllCommentsForArticleController);
articlesRouter.post('/:article_id/comments', postNewCommentController);
articlesRouter.patch('/:article_id', patchArticleByIdController);

module.exports = articlesRouter;