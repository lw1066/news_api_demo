const { deleteCommentById } = require("../models/delete-comment-by-id.model");

exports.deleteCommentByIdController = async(req, res, next) => {
    const { comment_id } = req.params;
    try{
        const result = await deleteCommentById(comment_id);
        res.status(204).send();
    }catch (err) {
        next(err);
    }
};