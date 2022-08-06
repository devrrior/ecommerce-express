import argon2 from 'argon2';
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

  it('Create user with an existing email', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/users')
      .send(userPayloadWithoutID)
      .set('Accept', 'application/json');

    expect(statusCode).toBe(400);
  });

  it('Get a user by id', async () => {
    await UserService.createOne({
      ...userPayloadWithID,
      password: await argon2.hash(userPayloadWithID.password),
    });
    const { statusCode, body } = await request(app).get(
      `/api/v1/users/${userPayloadWithID._id}`
    );

    expect(statusCode).toBe(200);
    expect(body.email).toStrictEqual(userPayloadWithID.email);
  });

  it('Update User', async () => {
    const newName = 'Luis';

    const { statusCode: statusCodeTokens, body: bodyTokens } = await request(
      app
    )
      .post('/api/v1/auth/tokens')
      .send({
        email: userPayloadWithID.email,
        password: userPayloadWithID.password,
      });

    expect(statusCodeTokens).toBe(201);

    const { statusCode, body } = await request(app)
      .put(`/api/v1/users/${userPayloadWithID._id}`)
      .set('Authorization', 'Bearer ' + bodyTokens.access)
      .send({ firstName: newName });

    expect(statusCode).toBe(200);

    expect(body.firstName).toStrictEqual(newName);
  });

  it('Update User failed', async () => {
    const newName = 'Luis';

    const { statusCode: statusCodeTokens, body: bodyTokens } = await request(
      app
    )
      .post('/api/v1/auth/tokens')
      .send({
        email: userPayloadWithoutID.email,
        password: userPayloadWithoutID.password,
      });
    expect(statusCodeTokens).toBe(201);

    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userPayloadWithID._id}`)
      .set('Authorization', 'Bearer ' + bodyTokens.access)
      .send({ firstName: newName });

    expect(statusCode).toBe(403);
  });

  it('Delete User failed', async () => {
    const { statusCode: statusCodeTokens, body: bodyTokens } = await request(
      app
    )
      .post('/api/v1/auth/tokens')
      .send({
        email: userPayloadWithoutID.email,
        password: userPayloadWithoutID.password,
      });

    expect(statusCodeTokens).toBe(201);

    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userPayloadWithID._id}`)
      .set('Authorization', 'Bearer ' + bodyTokens.access);

    expect(statusCode).toBe(403);
  });

  it('Delete User', async () => {
    const { statusCode: statusCodeTokens, body: bodyTokens } = await request(
      app
    )
      .post('/api/v1/auth/tokens')
      .send({
        email: userPayloadWithID.email,
        password: userPayloadWithID.password,
      });

    expect(statusCodeTokens).toBe(201);

    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userPayloadWithID._id}`)
      .set('Authorization', 'Bearer ' + bodyTokens.access);

    expect(statusCode).toBe(204);
  });
});
