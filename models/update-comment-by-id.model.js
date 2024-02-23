const db = require('../db/connection');

exports.updateCommentById = async (comment_id, { inc_votes }) => {
    const result = await db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`, [inc_votes, comment_id])

    if (result.rowCount === 0) {
        return Promise.reject({statusCode: 404, message: `comment ID ${comment_id} does not exist`})
    }
    return result.rows[0]
};