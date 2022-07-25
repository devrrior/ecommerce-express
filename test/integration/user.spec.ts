import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import UserService from '../../src/api/v1/services/user.service';
import app from '../../src/config/app';

const userPayloadWithoutID = {
  email: 'devrrior@gmail.com',
  password: 'fernando123',
  passwordConfirmation: 'fernando123',
  firstName: 'Fernando',
  lastName: 'Guerrero',
};

const userPayloadWithID = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'fer@gmail.com',
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

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('Create a user', async () => {
    const { statusCode, body } = await request(app)
      .post('/api/v1/users')
      .send(userPayloadWithoutID)
      .set('Accept', 'application/json');

    expect(statusCode).toBe(201);
    expect(body.firstName).toStrictEqual(userPayloadWithoutID.firstName);
  });

  it('Get a user by id', async () => {
    await UserService.createOne(userPayloadWithID);
    const { statusCode, body } = await request(app).get(
      `/api/v1/users/${userPayloadWithID._id}`
    );

    expect(statusCode).toBe(200);
    expect(body.email).toStrictEqual(userPayloadWithID.email);
  });
});
