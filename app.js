const express = require('express');
const { getAllTopics } = require('./controllers/get-all-topics.controller');
const { getApiMapController } = require('./controllers/get-api-map.controller');
const { getArticleByIdController } = require('./controllers/get-article-by-id.controller');
const { getAllArticlesController } = require('./controllers/get-all-articles.controller');
const { getAllCommentsForArticleController } = require('./controllers/get-all-comments-for-article.controller');
const { postNewCommentController } = require('./controllers/post-new-comment.controller');
const { patchArticleByIdController } = require('./controllers/patch-article_by_id.controller');
const { deleteCommentByIdController } = require('./controllers/delete-comment-by-id.controller');
const { getAllUsersController } = require('./controllers/get-all-users.controller');

const app= express();

app.use(express.json());

app.get('/api', getApiMapController);

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticlesController);
app.get('/api/articles/:article_id', getArticleByIdController);
app.get('/api/articles/:article_id/comments', getAllCommentsForArticleController);
app.post('/api/articles/:article_id/comments', postNewCommentController);
app.patch('/api/articles/:article_id', patchArticleByIdController);

app.delete('/api/comments/:comment_id', deleteCommentByIdController);

app.get('/api/users', getAllUsersController);

app.use((req, res, next) => {
    const err = new Error(`Page not found - ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg:'bad request - invalid id'});
    }
    if(err.code === '23503') {
        res.status(404).send({msg: `bad request - ${err.detail}`})
    }
    if(err.code === '23502') {
        res.status(400).send({msg: `bad request - missing information`})
    }
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({msg: err.message});
});

module.exports = app;