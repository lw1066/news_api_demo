const db = require('../db/connection');

exports.updateArticleById = async ({ inc_votes }, article_id) => {
    const result = await db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`, [inc_votes, article_id])

    if (result.rowCount === 0) {
        return Promise.reject({statusCode: 404, message: `article ID ${article_id} does not exist`})
    }
    return result.rows[0]
};
