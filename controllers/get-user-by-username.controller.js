const { selectUserByUsername } = require("../models/select-user-by-username.model");


exports.getUserByUsernameController = async (req, res, next) => {
    const { username } = req.params;
    try{
        const userData = await selectUserByUsername(username);
        res.status(200).send(userData);
    } catch (err) {
        next(err);
    }
};