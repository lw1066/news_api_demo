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
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:true});
        expect(Object.keys(result.body.articles[0])).toEqual(expectedColumns);
    })
})

describe('GET/api/articles/:article_id/comments', () => {
    it('200: responds with an array of comments with appropriate columns, sorted by created_at in descending order', async () => {
        const result = await request(app).get('/api/articles/1/comments');
        const expectedColumns = ['comment_id', 'body', 'article_id', 'author', 'votes', 'created_at'];
        const firstComment = result.body.comments[0];

        expect(result.status).toBe(200);
        expect(result.body.comments).toHaveLength(11);
        expect(result.body.comments).toBeSortedBy('created_at', {descending:true});
        expect(Object.keys(firstComment).sort()).toEqual(expectedColumns.sort());
        expect(typeof firstComment.comment_id).toBe('number');
        expect(typeof firstComment.article_id).toBe('number');
        expect(typeof firstComment.votes).toBe('number');
        expect(typeof firstComment.body).toBe('string');
        expect(typeof firstComment.author).toBe('string');
        expect(typeof firstComment.body).toBe('string');
    })
    it('200: responds with 200 and comments as an empty array when given a valid article_id with no comments', async () => {
        const result = await request(app).get('/api/articles/2/comments');
        
        expect(result.status).toBe(200);
        expect(result.body.comments).toEqual([]);
    })
    it('400: returns bad request - invalid id, when given an invalid article_id', async () => {
        const result =  await request(app).get('/api/articles/invalidId/comments');

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('404: returns No article for id 999, when given an valid article_id that does not exist', async () => {
        const result =  await request(app).get('/api/articles/888/comments');

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('No entry for id 888');
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    it('200: returns posted object with provided body and votes(set to 0) + created_at + comment_id added', async () => {
        const body = {
            userName: "rogersop",
            body: "I really liked this comment here."
        }
        const result = await request(app).post('/api/articles/2/comments').send(body)
        
        // calculate time difference between date now and db created_at time to allow for lag. Have allowed 5ms lag in expect statement below.
        const now = new Date();
        const dbNow = new Date (result.body.created_at);
        const timeDifference = Math.abs((now - dbNow)/1000);

        expect(timeDifference).toBeLessThan(6);  //allow 5ms lag
        expect(result.status).toBe(200);
        expect(result.body).toEqual({
            comment_id: 19,
            body: 'I really liked this comment here.',
            article_id: 2,
            author: 'rogersop',
            votes: 0,
            created_at: expect.any(String)       
        });
    })
    it('400: returns bad request if article_id is invalid', async () => {
        const body = {
            userName: "rogersop",
            body: "I really liked this comment here."
        };
        const result = await request(app).post('/api/articles/invalidID/comments').send(body);

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('400: returns bad request if userName is invalid', async () => {
        const body = {
            userName: "rogerso",
            body: "I really liked this comment here."
        };
        const result = await request(app).post('/api/articles/1/comments').send(body);

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - userName rogerso does not exist.');
    })
})
