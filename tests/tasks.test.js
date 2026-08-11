const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');

/**
 * Integration tests for the Task Management API.
 *
 * Requirements:
 * - Set MONGODB_URI in your environment (or in a .env file) to a MongoDB Atlas connection string.
 * - Prefer a dedicated test database/cluster so test data does not mix with development data.
 *
 * Run: npm test
 */

require('dotenv').config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    throw new Error(
      'MONGODB_URI must be set to run tests. Copy .env.example to .env and add your Atlas connection string.'
    );
  }

  await mongoose.connect(uri);
});

afterAll(async () => {
  // Clean up only documents created during this test run when possible
  await mongoose.connection.close();
});

describe('Health endpoint', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      message: 'Task Management API is running',
    });
  });
});

describe('Task API', () => {
  let createdTaskId;

  it('POST /api/tasks should create a task', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: 'Test Task',
      description: 'Created by automated test',
      status: 'pending',
      priority: 'high',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toBe('Test Task');
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.priority).toBe('high');
    expect(res.body.data).toHaveProperty('createdAt');
    expect(res.body.data).toHaveProperty('updatedAt');

    createdTaskId = res.body.data._id;
  });

  it('POST /api/tasks should reject invalid payload', async () => {
    const res = await request(app).post('/api/tasks').send({
      title: '',
      description: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/tasks should return tasks', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/tasks/:id should return a task', async () => {
    const res = await request(app).get(`/api/tasks/${createdTaskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(createdTaskId);
    expect(res.body.data.title).toBe('Test Task');
  });

  it('GET /api/tasks/:id should return 404 for unknown id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/tasks/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    const res = await request(app).put(`/api/tasks/${createdTaskId}`).send({
      status: 'in-progress',
      priority: 'medium',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in-progress');
    expect(res.body.data.priority).toBe('medium');
  });

  it('DELETE /api/tasks/:id should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Task deleted successfully');

    const check = await request(app).get(`/api/tasks/${createdTaskId}`);
    expect(check.statusCode).toBe(404);
  });
});
