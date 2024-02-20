const { insertNewComment } = require("../models/insert-new-comment.model");

exports.postNewCommentController = async(req, res, next) => {
    const { article_id } = req.params;
    const commentToPost = req.body;
    try {
        const result = await insertNewComment(commentToPost, article_id);
        res.status(201).send(result.rows[0]);
    } catch (err) {
        err.detail = `userName ${commentToPost.userName} does not exist.`;
        next(err);
    }
};