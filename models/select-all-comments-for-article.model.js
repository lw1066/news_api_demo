const db = require('../db/connection');

exports.selectAllCommentsForArticle = async (article_id) => {
    const comments = await db.query(
        `SELECT c.comment_id, c.body, c.article_id, c.author, c.votes, c.created_at
        FROM comments c
        WHERE c.article_id = $1
        ORDER BY c.created_at DESC`, [article_id]
    );
    return comments.rows;
};