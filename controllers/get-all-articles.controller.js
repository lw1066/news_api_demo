const { selectAllArticles } = require("../models/select-all-articles.model");


exports.getAllArticlesController = async (req, res, next) => {
    try{
        const result = await selectAllArticles();
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};