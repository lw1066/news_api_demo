const db = require('../db/connection');

exports.selectAllArticles = async (topic) => {

    const queryArray = [];
    let queryString = `SELECT articles.article_id, 
            articles.title, 
            articles.topic, 
            articles.author, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url, 
            COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id`;

    if(topic) {
        queryString += ` WHERE topic = $1`;
        queryArray.push(topic);
    }

    queryString += ` GROUP BY 
            articles.article_id, 
            articles.title, 
            articles.topic, 
            articles.author, 
            articles.created_at, 
            articles.votes, 
            articles.article_img_url
        ORDER BY articles.created_at DESC;`;

    const result = await db.query(queryString, queryArray);
    if (result.rows.length === 0) {
        return Promise.reject({statusCode: 404, message: `No articles for topic: ${topic}`});
    }
    return result.rows;
};