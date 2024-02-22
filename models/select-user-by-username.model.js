const db = require('../db/connection');

exports.selectUserByUsername = async (username) => {
   const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
   if(result.rows.length ===  0){
    return Promise.reject({statusCode: 404, message: `No user for username ${username}`});
   }
   return result.rows[0];

};