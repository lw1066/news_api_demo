const db = require('../db/connection');
const { selectArticleById } = require('./select-article-by -id.model');

exports.insertNewArticle = async ({ author, title, body, topic, article_img_url }) => {
    if (title === '' || body === '') {
        return Promise.reject({statusCode: 400, message: `body or title can't be empty`});
    }
    const result = await db.query(
        `INSERT INTO articles (author, title, body, topic, article_img_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [author, title, body, topic, article_img_url]);

    const newArticleId = result.rows[0].article_id;  
    const addedArticle =  await selectArticleById(newArticleId);

    return addedArticle;
};