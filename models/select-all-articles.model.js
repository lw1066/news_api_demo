const db = require('../db/connection');

exports.selectAllArticles = async (topic) => {

    const queryArray = [];
    let queryString = `SELECT a.article_id, 
            a.title, 
            a.topic, 
            a.author, 
            a.created_at, 
            a.votes, 
            a.article_img_url, 
            COUNT(c.article_id)::INTEGER AS comment_count 
        FROM articles a
        LEFT JOIN comments c
        ON a.article_id = c.article_id`;

    if(topic) {
        queryString += ` WHERE topic = $1`;
        queryArray.push(topic);
    }

    queryString += ` GROUP BY 
            a.article_id
        ORDER BY a.created_at DESC;`;

    const result = await db.query(queryString, queryArray);
    if (result.rows.length === 0) {
        const topicExists = await db.query(`SELECT * FROM topics WHERE slug=$1;`, [topic]);
        if (!topicExists.rows[0]) {
            return Promise.reject({statusCode: 400, message: `Bad request - Not a valid topic: ${topic}`});
        }
        return result.rows;
    }
    return result.rows;
};