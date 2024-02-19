const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const fs = require('fs/promises');



beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    db.end()
});

describe('404 page not found', () => {
    it('404: responds with a 404 page not found for invalid pages', async () => {
        const result = await request(app).get('/api/notValid')
        
        expect(result.status).toBe(404);
        expect(result.body).toEqual({msg: 'Page not found - /api/notValid'})
    })
})

describe('GET/api/topics', () => {
    it('200: responds with successful status 200', async () => {
        await request(app)
        .get('/api/topics')
        .expect(200)
    })
    it('responds with slugs + descriptions for all topics', async () => {
        const result = await request(app).get('/api/topics')

        expect(result.status).toBe(200)
        expect(result.body).toHaveLength(3);
        result.body.forEach(topic => {
            expect(topic).toHaveProperty('slug');
            expect(topic).toHaveProperty('description');
        })
    })
});


describe('GET/api', () => {
    it('200 responds with successful status', async () => {
        await request(app)
        .get('/api')
        .expect(200);
    })
    it('responds with a list of current api objects', async () => {
        const JsonData = await fs.readFile(`${__dirname}/../endpoints.json`);
        const currentApiMapObjects = JSON.parse(JsonData);
        const result = await request(app).get('/api');

        expect(result.status).toBe(200);
        expect(result.body).toEqual(currentApiMapObjects);
    })
})