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
    it('200: responds with a list of current api objects', async () => {
        const JsonData = await fs.readFile(`${__dirname}/../endpoints.json`);
        const currentApiMapObjects = JSON.parse(JsonData);
        const result = await request(app).get('/api');

        expect(result.status).toBe(200);
        expect(result.body).toEqual(currentApiMapObjects);
    })
})

describe('GET/api/articles/:article_id', () => {
    it('200: responds with correct article for provided article_id', async () => {
        const result =  await request(app).get('/api/articles/1');

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
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
    it('400: responds with bad request if given invalid article_id', async() => {
        const result =  await request(app).get('/api/articles/notValid');

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('404: responds with a 404 id not found if given valid article_id that does not exist', async() => {
        const result =  await request(app).get('/api/articles/999');

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('No entry for id 999');
    })
    it('FEATURE REQUEST: response article includes comment_count', async() => {
        const result =  await request(app).get('/api/articles/1');

        expect(result.status).toBe(200);
        expect(result.body).toMatchObject({
           comment_count: 11
          });
    })
})

describe('GET/api/articles', () => {
    it('200: responds with an array of all articles without body texts, sorted in descending order by created_at', async () => {
        const result = await request(app).get('/api/articles');
        const expectedColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];
        const firstArticle = result.body.articles[0];

        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:true});
        expect(Object.keys(firstArticle)).toEqual(expectedColumns);
        expect(typeof firstArticle.comment_count).toBe('number');
        expect(typeof firstArticle.article_id).toBe('number');
        expect(typeof firstArticle.title).toBe('string');
        expect(typeof firstArticle.author).toBe('string');
        expect(typeof firstArticle.votes).toBe('number');
        expect(typeof firstArticle.topic).toBe('string');
        expect(typeof firstArticle.created_at).toBe('string');
        expect(typeof firstArticle.article_img_url).toBe('string');
    })
    it('200: returns an empty array if given a valid topic which no articles use', async () => {
        const result = await request(app).get('/api/articles?topic=paper');
        
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(0);
        expect(result.body.articles).toBeInstanceOf(Array);
    })
    it('400: returns bad request if given an invalid topic', async () => {
        const result = await request(app).get('/api/articles?topic=notatopic');
        
        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('Bad request - Not a valid topic: notatopic');
    })
    it('FEATURE REQUEST: 200: accepts a topic query which filters articles by topic', async () => {
        const result = await request(app).get('/api/articles?topic=cats');
        const expectedColumns = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(1);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:true});
        expect(Object.keys(result.body.articles[0])).toEqual(expectedColumns);
        expect(result.body.articles[0].topic).toBe('cats')
    })   
})
describe('FEATURE REQUEST: order query', () => {
    it('defaults to descending(DESC)', async () => {
        const result = await request(app).get('/api/articles');
      
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:true})
    })
    it('accepts ascending(ASC) - not case sensitive', async () => {
        const result = await request(app).get('/api/articles?order=asc');
      
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:false})
    })
    it('400: returns an error if given any other value for order query', async () => {
        const result = await request(app).get('/api/articles?order=notValid');
      
        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('Bad request - Not a valid order query: notValid');
    })
})
describe('FEATURE REQUEST: sort_by query', () => {
    it('defaults to created_at column', async () => {
        const result = await request(app).get('/api/articles');
      
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('created_at', {descending:true});
    })
    it('accepts any other valid column to sort_by', async () => {
        const result = await request(app).get('/api/articles?sort_by=title');
      
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('title', {descending:true});
    })
    it('400: returns error if given invalid column to sort_by', async () => {
        const result = await request(app).get('/api/articles?sort_by=notValid');
      
        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('Bad request - Not a valid column to sort by: notValid');
    })
    it('can be used with order ASC', async () => {
        const result = await request(app).get('/api/articles?sort_by=title&order=ASC');
      
        expect(result.status).toBe(200);
        expect(result.body.articles).toHaveLength(13);
        expect(result.body.articles).toBeSortedBy('title', {descending:false});;
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

describe('POST/api/articles/:article_id/comments', () => {
    it('201: returns posted object with provided body and votes(set to 0) + created_at + comment_id added', async () => {
        const body = {
            userName: "rogersop",
            body: "I really liked this comment here."
        }
        const result = await request(app).post('/api/articles/2/comments').send(body);

        expect(result.status).toBe(201);
        expect(result.body).toEqual({
            comment_id: 19,
            body: 'I really liked this comment here.',
            article_id: 2,
            author: 'rogersop',
            votes: 0,
            created_at: expect.any(String)       
        });
        expect(result.body.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
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
    it('404: returns not found if userName is not in db', async () => {
        const body = {
            userName: "rogerso",
            body: "I really liked this comment here."
        };
        const result = await request(app).post('/api/articles/1/comments').send(body);

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe("provided details not found");
    })
    it('400: returns bad request if given incomplete req.body to post', async () => {
        const body = {
            userName: "rogerso",
        };
        const result = await request(app).post('/api/articles/1/comments').send(body);

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - missing information');
    })
})

describe('PATCH/api/articles/:article_id', () => {
    it('200: returns an updated article if given an object of {inc_votes: [number of votes]}- can be a + or - number', async () => {
        const body = {
            inc_votes : 1
        };
        const body2 = {
            inc_votes : 50
        };
        const body3 = {
            inc_votes : -100
        };

        const result = await request(app).patch('/api/articles/1').send(body);
        const result2 = await request(app).patch('/api/articles/1').send(body2);
        const result3 = await request(app).patch('/api/articles/1').send(body3);

        expect(result.body).toEqual( {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: new Date(1594329060000).toISOString(),
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        expect(result2.body).toEqual( {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: new Date(1594329060000).toISOString(),
            votes: 151,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        expect(result3.body).toEqual( {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: new Date(1594329060000).toISOString(),
            votes: 51,
            article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
    })
    it('400: returns bad request if given an object with invalid inc_votes value', async () => {
        const body = {
            inc_votes : 'invalid'
        };

        const result = await request(app).patch('/api/articles/1').send(body);

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('400: returns bad request if given an invalid article_id', async () => {
        const body = {
            inc_votes : 1
        };

        const result = await request(app).patch('/api/articles/invalidId').send(body);

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
    it('404: returns not found if given a valid article_id that does not exist in db', async () => {
        const body = {
            inc_votes : 1
        };

        const result = await request(app).patch('/api/articles/999').send(body);

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('article ID 999 does not exist');
    })
})
describe('DELETE/api/comments/:comment_id', () => {
    it('204: deletes given comment and returns 204 code', async () => {
        const result = await request(app).delete('/api/comments/3');
        
        expect(result.status).toBe(204);
        const deletedCheck = await db.query('SELECT * FROM comments WHERE comment_id = $1', [3]);
        expect(deletedCheck.rows).toHaveLength(0);
    })
    it('404: returns not found if comment_id does not exist', async () => {
        const result = await request(app).delete('/api/comments/888');

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('Cannot delete - comment ID 888 does not found');
    })
    it('400: returns bad request if comment_id is invalid', async () => {
        const result = await request(app).delete('/api/comments/invalidID');

        expect(result.status).toBe(400);
        const err = result.body;
        expect(err.msg).toBe('bad request - invalid id');
    })
})
describe('GET/api/users', () => {
    it('200: returns an array of all users with properties - username, name, avatar_url', async () => {
        const result = await request(app).get('/api/users')

        const { users } = result.body;
        expect(users).toHaveLength(4);
        users.forEach(user => {
            expect(user).toEqual(expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            }));
        })
    })
})
describe('GET/api/users/:username', () => {
    it('200: serves a user object of provided :username with properties - username, avatar_url + name', async () => {
        const result = await request(app).get('/api/users/lurker');

        const user = result.body;
        expect(user).toEqual(expect.objectContaining({
            username: 'lurker',
            name: 'do_nothing',
            avatar_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
        }));
    })
    it('404: returns not found if a non-existent username is entered', async () => {
        const result = await request(app).get('/api/users/notauser');

        expect(result.status).toBe(404);
        const err = result.body;
        expect(err.msg).toBe('No user for username notauser');
    })
})
describe('PATCH/api/comments/:comment_id', () => {
    it('200: returns comment object with vote property updated by amount provided by inc_votes', async () => {
        const body = { inc_votes : 1 }
        const body2 = { inc_votes : -10 }
        const result = await request(app).patch('/api/comments/7').send(body)
        const result2 = await request(app).patch('/api/comments/7').send(body2)

        expect(result.body).toEqual(expect.objectContaining({ votes: 1 }))
        expect(result2.body).toEqual(expect.objectContaining({ votes: -9 }))
    })
    it('400: returns bad request if given a bad or empty body ', async () => {
        const body = { inc_votes : 'notvalid' }
        const body2 = { }
        const result = await request(app).patch('/api/comments/7').send(body)
        const result2 = await request(app).patch('/api/comments/7').send(body2)

        expect(result.body).toEqual(expect.objectContaining({ "msg": "bad request - invalid vote value: notvalid" }))
        expect(result2.body).toEqual(expect.objectContaining({"msg": "bad request - missing information" }))
    })
})
describe('POST/api/articles', () => {
    it('200: returns a new article with all relevant fields when given a correct body', async () => {
        const body = {
            author: 'rogersop',
            title: 'boating for boys', 
            body: 'Boats are fun but can be difficult to clean.',
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }

        const result = await request(app).post('/api/articles').send(body);

        expect(result.body).toMatchObject({
            author: 'rogersop',
            title: 'boating for boys', 
            body: 'Boats are fun but can be difficult to clean.',
            topic: 'paper',
            article_id: 14,
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        })
        expect(result.body.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    })
    it('400: returns bad request if title or body are missing/blank/undefined in req.body', async () => {
        const body = {
            author: 'rogersop',
            title: 'boating for boys', 
            body: '',
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }

        const body2 = {
            author: 'rogersop',
            title: 'boating for boys', 
            body: undefined,
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }

        const body3 = {
            author: 'rogersop',
            title: 'boating for boys', 
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }



        const result = await request(app).post('/api/articles').send(body);
        const result2 = await request(app).post('/api/articles').send(body2);
        const result3 = await request(app).post('/api/articles').send(body3);

        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("body or title can't be empty");
        expect(result2.status).toBe(400);
        expect(result2.body.msg).toBe("bad request - missing information");
        expect(result3.status).toBe(400);
        expect(result3.body.msg).toBe("bad request - missing information");

    })
    it('404: returns not found if author or topic are not in db', async () => {
        const body = {
            author: 'unknownPerson',
            title: 'boating for boys', 
            body: 'Boats are fun but can be difficult to clean.',
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }
        const body2 = {
            author: 'rogersop',
            title: 'boating for boys', 
            body: 'paper boats are the best boats',
            topic: 'unknownTopic',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }

        const result = await request(app).post('/api/articles').send(body);
        const result2 = await request(app).post('/api/articles').send(body2);

        expect(result.status).toBe(404);
        expect(result.body.msg).toBe('provided details not found');
        expect(result2.status).toBe(404);
        expect(result2.body.msg).toBe("provided details not found");
    })
    it('400: returns bad request if author or topic are missing from req.body', async () => {
        const body = {
            title: 'boating for boys', 
            body: 'Boats are fun but can be difficult to clean.',
            topic: 'paper',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }
        const body2 = {
            author: 'rogersop',
            title: 'boating for boys', 
            body: 'paper boats are the best boats',
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }

        const result = await request(app).post('/api/articles').send(body);
        const result2 = await request(app).post('/api/articles').send(body2);
        
        expect(result.status).toBe(400);
        expect(result.body.msg).toBe("bad request - missing information");
        expect(result2.status).toBe(400);
        expect(result2.body.msg).toBe("bad request - missing information");

    })
})