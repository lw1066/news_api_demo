const { selectAllUsers } = require("../models/select-all-users.model");

exports.getAllUsersController = async (req, res, next) => {
    try{
        const users = await selectAllUsers();
        res.status(200).send({users});
    }catch (err) {
        next(err);
    }
};