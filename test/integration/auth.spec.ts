import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';

import UserService from '../../src/api/v1/services/user.service';
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
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (const connection of collections) {
      await connection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test('Generate JWT', async () => {
    await UserService.createOne(userPayload);
    const { statusCode } = await supertest(app)
      .post('/api/v1/auth/token')
      .send({
        email: userPayload.email,
        password: userPayload.password,
      });

    expect(statusCode).toBe(201);
  });
});
