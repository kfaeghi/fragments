const request = require('supertest');
const app = require('../../src/app');
var tmp = "";


describe('GET AND POST /v1/fragments/:id and /v1/fragments/', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));
  
    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
      request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));
  
    // Using a valid username/password pair should give a success result with a .fragments array
    test('authenticated users create fragments', async () => {
      const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send('This is a fragment');
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      tmp = res.body.fragment.id
    });

    test('authenticated users retrieve fragments by id', async () => {
      console.log(tmp)
      const res = await request(app).get('/v1/fragments/' + tmp).auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  
    // TODO: we'll need to add tests to check the contents of the fragments array later
  });