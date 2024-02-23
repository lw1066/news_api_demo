const { updateCommentById } = require("../models/update-comment-by-id.model");


exports.patchCommentByIdController = async (req, res, next) => {
    const updateData = req.body;
    const { comment_id } = req.params;
    try{
        const result = await updateCommentById(comment_id, updateData);
        res.status(200).send(result);
    } catch (err) {
        err.msg = `bad request - invalid vote value: ${updateData.inc_votes}`
        next(err);
    }
};