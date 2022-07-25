import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/config/app';

const userPayload = {
  email: 'devrrior@gmail.com',
  password: 'fernando123',
  passwordConfirmation: 'fernando123',
  firstName: 'Fernando',
  lastName: 'Guerrero',
};

describe('/tokens', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await request(app).post('/api/v1/users').send(userPayload);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test('Generate JWT', async () => {
    const { statusCode } = await request(app).post('/api/v1/auth/token').send({
      email: userPayload.email,
      password: userPayload.password,
    });

    expect(statusCode).toBe(201);
  });

  test('Refresh tokens', async () => {
    const { statusCode: generateStatusCode, body } = await request(app)
      .post('/api/v1/auth/token')
      .send({ email: userPayload.email, password: userPayload.password });

    expect(generateStatusCode).toBe(201);

    const { statusCode } = await request(app)
      .post('/api/v1/auth/token/refresh')
      .send({ refresh: body.refresh });

    expect(statusCode).toBe(201);
  });
});
