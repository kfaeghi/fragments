const request = require('supertest');
const app = require('../../src/app');
var tmp = [];


describe('GET AND POST /v1/fragments/:id and /v1/fragments/', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));
  
    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
      request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));
  
    // Using a valid username/password pair should give a success result with a .fragments array
    test('authenticated users create fragments (POST text/plain)', async () => {
      const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/plain').send('This is a fragment');
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      tmp.push(res.body.fragment.id);
    });

    test('authenticated users create fragments (POST Test Markdown)', async () => {
      const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/markdown').send('# This is a fragment');
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      tmp.push(res.body.fragment.id);
    });


    test('authenticated users create fragments (POST Test HTML)', async () => {
      const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'text/html').send('<h1>This is a fragment</h1>');
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      //console.log(res)
      tmp.push(res.body.fragment.id);
    });

    test('authenticated users create fragments (POST Test application/json)', async () => {

      const json = {
        color: "red",
        value: "#f00"
      }
      const res = await request(app).post('/v1/fragments').auth('user1@email.com', 'password1').set('Content-Type', 'application/json').send(json);
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      tmp.push(res.body.fragment.id);
    });

    test('authenticated users retrieve fragments by id', async () => {
      const res = await request(app).get('/v1/fragments/' + tmp[0]).auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      //expect(res.body.status).toBe('ok');
    });
    

    test('authenticated users get a fragments array', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
    });


    test('authenticated users get a fragments array expanded', async () => {
      const res = await request(app).get('/v1/fragments/?expand=1').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
    });


    test('authenticated users retrieve fragments by id info', async () => {
      const res = await request(app).get('/v1/fragments/' + tmp[0] + "/info").auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    test('authenticated users retrieve fragments by id extension', async () => {
      const res = await request(app).get('/v1/fragments/' + tmp[0] + ".html").auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('text/html');
    });

    test('authenticated users retrieve fragments by id extension markdown', async () => {
      const res = await request(app).get('/v1/fragments/' + tmp[1] + ".html").auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('text/html');
    });

  
    // TODO: we'll need to add tests to check the contents of the fragments array later
  });