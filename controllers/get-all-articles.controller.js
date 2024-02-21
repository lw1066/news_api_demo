const { selectAllArticles } = require("../models/select-all-articles.model");


exports.getAllArticlesController = async (req, res, next) => {
    const { topic } = req.query;
    try{
        const articles = await selectAllArticles(topic);
        res.status(200).send({ articles });
    } catch (err) {
        next(err);
    }
};