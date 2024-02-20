const db = require('../db/connection');

exports.insertNewComment = async ({userName, body}, article_id) => {
    const result = await db.query(
        `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [userName, body, article_id])
    return result;
};