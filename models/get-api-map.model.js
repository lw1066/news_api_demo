const fs = require('fs/promises');

exports.getApiMap = async () => {
    const apiMap = await fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8');
    return JSON.parse(apiMap);  
};