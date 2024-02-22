const { selectAllArticles } = require("../models/select-all-articles.model");


exports.getAllArticlesController = async (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    try{
        const articles = await selectAllArticles(topic, sort_by, order);
        res.status(200).send({ articles });
    } catch (err) {
        next(err);
    }
};