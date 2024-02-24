const express = require('express');
const app= express();
const apiRouter = require('./routes/api-router');

app.use(express.json());

app.use('/', apiRouter);

app.use((req, res, next) => {
    const err = new Error(`Page not found - ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: err.msg ||'bad request - invalid id'});
    }
    if(err.code === '23503') {
        console.log('err in app-----------', err)
        res.status(404).send({msg: err.msg || `provided details not found`, errDetails: `PSQL error code - ${err.code}, details -${err.detail}`})
    }
    if(err.code === '23502') {
        res.status(400).send({msg: `bad request - missing information`})
    }
    next(err);
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({msg: err.message});
});

module.exports = app;