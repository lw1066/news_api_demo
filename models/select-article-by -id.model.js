const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
    const result = await db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
    if (result.rowCount === 0) {
        return Promise.reject({statusCode: 404, message: `No entry for id ${article_id}`});
    }
    return result.rows[0];
}