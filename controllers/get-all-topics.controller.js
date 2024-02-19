const { selectAllTopics } = require("../models/select-all-topics.model")


exports.getAllTopics = async (req, res, next) => {

    try{
        const topics = await selectAllTopics();
        return res.status(200).send(topics);
    } catch (err) {
        next(err);
    }
}