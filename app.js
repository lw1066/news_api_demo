const express = require('express');
const { getAllTopics } = require('./controllers/get-all-topics.controller');
const { getApiMapController } = require('./controllers/get-api-map.controller');



const app= express();

app.use(express.json());

app.get('/api', getApiMapController);

app.get('/api/topics', getAllTopics);

app.use((req, res, next) => {
    const err = new Error(`Page not found - ${req.originalUrl}`);
    err.statusCode = 404;
    next(err)
})

app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).send({msg: err.message});
    }
)

module.exports = app;