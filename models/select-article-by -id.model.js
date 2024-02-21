const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
    const result = await db.query(`SELECT a.article_id, 
        a.title, 
        a.topic, 
        a.author,
        a.body,
        a.created_at, 
        a.votes, 
        a.article_img_url, 
        COUNT(c.article_id)::INTEGER AS comment_count 
    FROM articles a
    LEFT JOIN comments c
    ON a.article_id = c.article_id
    WHERE a.article_id = $1
    GROUP BY 
        a.article_id; `, [article_id]);
    if (result.rowCount === 0) {
        return Promise.reject({statusCode: 404, message: `No entry for id ${article_id}`});
    }
    return result.rows[0];
}