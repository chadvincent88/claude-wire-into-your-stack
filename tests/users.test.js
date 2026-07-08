const http = require('node:http');
const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../server');
const store = require('../db/store');

const server = http.createServer(app);

test.before(() => new Promise((resolve, reject) => {
  server.listen(0, '127.0.0.1', (err) => (err ? reject(err) : resolve()));
}));
test.after(() => new Promise((resolve, reject) => {
  server.close((err) => (err ? reject(err) : resolve()));
}));
test.beforeEach(() => store.reset());

test('GET /users returns the seeded list', async () => {
  const res = await request(server).get('/users');
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 2);
});

test('GET /users/:id returns 404 for a missing user', async () => {
  const res = await request(server).get('/users/999');
  assert.equal(res.status, 404);
});

test('POST /users creates a user', async () => {
  const res = await request(server)
    .post('/users')
    .send({ name: 'Grace Hopper', email: 'grace@example.com' });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, 'Grace Hopper');
  assert.ok(res.body.id);
});

test('POST /users returns 400 when name or email is missing', async () => {
  const res = await request(server).post('/users').send({ name: 'No Email' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'name and email are required');
});

test('PUT /users/:id updates an existing user', async () => {
  const res = await request(server).put('/users/1').send({ name: 'Ada L.' });
  assert.equal(res.status, 200);
  assert.equal(res.body.name, 'Ada L.');
});

test('PUT /users/:id returns 404 for a missing user', async () => {
  const res = await request(server).put('/users/999').send({ name: 'Nobody' });
  assert.equal(res.status, 404);
});

test('DELETE /users/:id removes an existing user', async () => {
  const res = await request(server).delete('/users/1');
  assert.equal(res.status, 204);
  const getRes = await request(server).get('/users/1');
  assert.equal(getRes.status, 404);
});

test('DELETE /users/:id returns 404 for a missing user', async () => {
  const res = await request(server).delete('/users/999');
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'User not found');
});
