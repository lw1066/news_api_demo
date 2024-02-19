const db = require('../db/connection');

exports.selectAllTopics = async () => {
    const topics = await db.query('SELECT * FROM topics')
    return topics.rows;
}