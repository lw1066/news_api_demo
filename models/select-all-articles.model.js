const db = require('../db/connection');

exports.selectAllArticles = async () => {
    const articles = await db.query(
        `SELECT a.article_id, 
            a.title, 
            a.topic, 
            a.author, 
            a.created_at, 
            a.votes, 
            a.article_img_url, 
            COUNT(c.article_id)::INTEGER AS comment_count 
        FROM articles a
        LEFT JOIN comments c
        ON a.article_id = c.article_id
        GROUP BY 
            a.article_id   
        ORDER BY a.created_at DESC;`
    );
    return articles.rows;
};