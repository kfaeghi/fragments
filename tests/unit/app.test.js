// tests/unit/app.test.js

const request = require('supertest');

// Get our Express app object (we don't need the server part)
const app = require('../../src/app');

describe('/ app.js test', () => {
    test('should return HTTP 404 response', async () => {
        const res = await request(app).get('/t');
        expect(res.statusCode).toBe(404);
    });
})