const { updateArticleById } = require("../models/update-article-by-id.model");


exports.patchArticleByIdController = async (req, res, next) => {
    const updateData = req.body;
    const { article_id } = req.params;
    try{
        const result = await updateArticleById(updateData, article_id);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};