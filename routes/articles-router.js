const articlesRouter = require('express').Router();
const { getAllArticlesController } = require('../controllers/get-all-articles.controller');
const { getAllCommentsForArticleController } = require('../controllers/get-all-comments-for-article.controller');
const { getArticleByIdController } = require('../controllers/get-article-by-id.controller');
const { patchArticleByIdController } = require('../controllers/patch-article-by-id.controller');
const { postNewArticleController } = require('../controllers/post-new-article.controller');
const { postNewCommentController } = require('../controllers/post-new-comment.controller');


articlesRouter
.route('/')
.get(getAllArticlesController)
.post(postNewArticleController);
articlesRouter
    .route('/:article_id')
    .get(getArticleByIdController)
    .patch(patchArticleByIdController);
articlesRouter
    .route('/:article_id/comments')
    .get(getAllCommentsForArticleController)
    .post(postNewCommentController);

module.exports = articlesRouter;