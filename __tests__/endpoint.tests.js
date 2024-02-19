const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const fs = require('fs/promises');
const { toBeSorted, toBeSortedBy } = require('jest-sorted');



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

describe('GET/api/article/:article_id', () => {
    it('200: responds with correct article for provided article_id', async () => {
        const result =  await request(app).get('/api/articles/1');

        expect(result.status).toBe(200);
        expect(result.body).toEqual( {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: new Date(1594329060000).toISOString(),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          });
    })
    it('400: responds with bad request if given invalid article_id', async () => {
        const result =  await request(app).get('/api/articles/notValid');

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('404: responds with a 404 id not found if given valid article_id that does not exist', async () => {
        const result =  await request(app).get('/api/articles/999');

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('No entry for id 999');
    })
})

describe('GET/api/articles', () => {
    it('200: responds with an array of all articles without body texts, sorted in descending order by created_at', async () => {
        const result = await request(app).get('/api/articles');
        const expectedColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];

        expect(result.status).toBe(200);
        expect(result.body).toHaveLength(13);
        expect(result.body).toBeSortedBy('created_at', {descending:true});
        expect(Object.keys(result.body[0])).toEqual(expectedColumns);
    })
})
