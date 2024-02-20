const db = require('../db/connection');

exports.deleteCommentById = async(comment_id) => {
    const result = await db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`, [comment_id]
    );
    if(result.rowCount === 0){
        return Promise.reject({statusCode: 404, message: `Cannot delete - comment ID ${comment_id} does not found`});
    }  
};