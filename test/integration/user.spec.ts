import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/config/app';
import UserService from '../../src/services/user.service';

const userPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'devrrior@gmail.com',
  password: 'fernando123',
  passwordConfirmation: 'fernando123',
  firstName: 'Fernando',
  lastName: 'Guerrero',
};

describe('/users', () => {
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

  it('Create a user', async () => {
    const { statusCode, body } = await request(app)
      .post('/api/v1/users')
      .send(userPayload)
      .set('Accept', 'application/json');

    expect(statusCode).toBe(201);
    expect(body.firstName).toStrictEqual(userPayload.firstName);
  });

  it('Get a user by id', async () => {
    await UserService.createOne(userPayload);
    const { statusCode, body } = await request(app).get(
      `/api/v1/users/${userPayload._id}`
    );

    expect(statusCode).toBe(200);
    expect(body.email).toStrictEqual(userPayload.email);
  });
});
