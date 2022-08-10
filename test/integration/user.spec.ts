import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import UserService from '../../src/api/v1/services/user.service';
import app from '../../src/config/app';

const userPayloadWithID1 = {
  _id: '',
  email: 'john@gmail.com',
  password: 'password',
  passwordConfirmation: 'password',
  firstName: 'John',
  lastName: 'Doe',
};

const userPayloadWithID2 = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'santiago@gmail.com',
  password: 'password',
  firstName: 'Santiago',
  lastName: 'Perez',
  verificationCode: '123456',
  verified: true,
};

const userPayloadWIthID3 = {
  email: 'marie@gmail.com',
  password: 'password',
  firstName: 'Marie',
  lastName: 'Doe',
};

let user1AuthAccessToken: string, user2AuthAccessToken: string;

describe('/users', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await UserService.createOne({
      ...userPayloadWithID2,
      password: await argon2.hash(userPayloadWithID2.password),
    });

    const { body } = await request(app).post('/api/v1/auth/tokens').send({
      email: userPayloadWithID2.email,
      password: userPayloadWithID2.password,
    });

    user2AuthAccessToken = body.access;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('Create a user', async () => {
    const { statusCode, body } = await request(app)
      .post('/api/v1/users')
      .send(userPayloadWithID1)
      .set('Accept', 'application/json');

    expect(statusCode).toBe(201);
    expect(body.firstName).toStrictEqual(userPayloadWithID1.firstName);

    // set verified to true
    userPayloadWithID1._id = body._id;
    await UserService.patchById(userPayloadWithID1._id, { verified: true });
  });

  it('Create user with an existing email', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/users')
      .send(userPayloadWithID1)
      .set('Accept', 'application/json');

    expect(statusCode).toBe(409);
  });

  it('Get a user by id', async () => {
    const { statusCode, body } = await request(app).get(
      `/api/v1/users/${userPayloadWithID2._id}`
    );

    expect(statusCode).toBe(200);
    expect(body.email).toStrictEqual(userPayloadWithID2.email);
  });

  it('Update User', async () => {
    const newName = 'Luis';

    const { statusCode, body } = await request(app)
      .put(`/api/v1/users/${userPayloadWithID2._id}`)
      .set('Authorization', 'Bearer ' + user2AuthAccessToken)
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
        email: userPayloadWithID1.email,
        password: userPayloadWithID1.password,
      });
    expect(statusCodeTokens).toBe(201);

    user1AuthAccessToken = bodyTokens.access;

    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userPayloadWithID2._id}`)
      .set('Authorization', 'Bearer ' + user1AuthAccessToken)
      .send({ firstName: newName });

    expect(statusCode).toBe(403);
  });

  it('Delete User failed', async () => {
    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userPayloadWithID2._id}`)
      .set('Authorization', 'Bearer ' + user1AuthAccessToken);

    expect(statusCode).toBe(403);
  });

  it('Delete User', async () => {
    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userPayloadWithID2._id}`)
      .set('Authorization', 'Bearer ' + user2AuthAccessToken);

    expect(statusCode).toBe(204);
  });

  it('Verify User', async () => {
    const VERIFICATION_TOKEN_SECRET_KEY =
      process.env.VERIFICATION_SECRET_KEY || '1234';

    const verificationCode = jwt.sign(
      { email: userPayloadWIthID3.email },
      VERIFICATION_TOKEN_SECRET_KEY
    );
    await UserService.createOne({
      ...userPayloadWIthID3,
      password: await argon2.hash(userPayloadWIthID3.password),
      verificationCode,
    });

    const { statusCode, body } = await request(app).post(
      `/api/v1/users/verify/${verificationCode}`
    );

    expect(statusCode).toBe(200);
    expect(body.email).toStrictEqual(userPayloadWIthID3.email);
  });

  it('Forgot Password', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/users/forgot-password')
      .send({ email: userPayloadWIthID3.email });

    expect(statusCode).toBe(200);
  });

  it('Reset Password', async () => {
    const user = await UserService.getByEmail(userPayloadWIthID3.email);

    const { statusCode } = await request(app)
      .post(`/api/v1/users/reset-password/${user?.passwordResetCode}`)
      .send({
        newPassword: '123456789',
        newPasswordConfirmation: '123456789',
      });

    expect(statusCode).toBe(200);
  });
});
