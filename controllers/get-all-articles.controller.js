const { selectAllArticles } = require("../models/select-all-articles.model");


exports.getAllArticlesController = async (req, res, next) => {
    try{
        const articles = await selectAllArticles();
        res.status(200).send({ articles });
    } catch (err) {
        next(err);
    }
};