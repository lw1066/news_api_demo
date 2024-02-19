const { selectArticleById } = require("../models/select-article-by -id.model");

exports.getArticleByIdController = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const result = await selectArticleById(article_id);
        res.status(200).send(result);
    } catch(err) {
        next(err);
    }
};