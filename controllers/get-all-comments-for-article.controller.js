const { selectAllCommentsForArticle } = require("../models/select-all-comments-for-article.model");
const { selectArticleById } = require("../models/select-article-by -id.model");


exports.getAllCommentsForArticleController = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const promises = [selectAllCommentsForArticle(article_id), selectArticleById(article_id)];
        const promiseResults = await Promise.all(promises);
        const comments = promiseResults[0];
        res.status(200).send({comments});
    }catch (err) {
        next(err);
    };
}