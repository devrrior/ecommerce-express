import argon2 from 'argon2';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import UserService from '../../src/api/v1/services/user.service';
import app from '../../src/config/app';

const userPayload = {
  email: 'santiago@gmail.com',
  password: 'password',
  firstName: 'Santiago',
  lastName: 'Perez',
  verificationCode: '123456',
};

let userAuthRefreshToken = '';

describe('/tokens', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await UserService.createOne({
      ...userPayload,
      password: await argon2.hash(userPayload.password),
      verified: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test('Generate JWT', async () => {
    const { statusCode, body } = await request(app)
      .post('/api/v1/auth/tokens')
      .send({
        email: userPayload.email,
        password: userPayload.password,
      });

    expect(statusCode).toBe(201);

    userAuthRefreshToken = body.refresh;
  });

  test('Refresh tokens', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/auth/tokens/refresh')
      .send({ refresh: userAuthRefreshToken });

    expect(statusCode).toBe(201);
  });
});
