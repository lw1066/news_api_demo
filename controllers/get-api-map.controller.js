const { getApiMap } = require("../models/get-api-map.model");

exports.getApiMapController = async (req, res, next) => {
    try {
        const apiMap = await getApiMap();
        res.status(200).send(apiMap);
    } catch (err) {
        err.message = 'API map file not found: ', err;
        next(err);
    }
};