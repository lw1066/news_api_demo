const { insertNewArticle } = require("../models/insert-new-article.model");

exports.postNewArticleController = async(req, res, next) => {
    const commentToPost = req.body;
    try {
        const result = await insertNewArticle(commentToPost);
        res.status(201).send(result);
    } catch (err) {     
        next(err);
    }
};