import argon2 from 'argon2';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import ITokens from '../../src/api/v1/interfaces/models/tokens.interface';
import { Role } from '../../src/api/v1/interfaces/models/user.interface';
import CategoryService from '../../src/api/v1/services/category.service';
import UserService from '../../src/api/v1/services/user.service';
import app from '../../src/config/app';

const userPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: 'devrrior@gmail.com',
  password: 'fernando123',
  passwordConfirmation: 'fernando123',
  role: Role.ADMIN,
  firstName: 'Fernando',
  lastName: 'Guerrero',
};

const categoryPayload = {
  name: 'technology',
};

const updateCategoryPayload = {
  name: 'electronic',
};

const categoriesPayload = [
  {
    name: 'health',
  },
  {
    name: 'sport',
  },
];

const baseUrl = '/api/v1';

let tokens: ITokens;

describe('/categories', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await UserService.createOne({
      ...userPayload,
      password: await argon2.hash(userPayload.password),
    });

    await CategoryService.createMany(categoriesPayload);

    const { body } = await request(app)
      .post(`${baseUrl}/auth/token`)
      .send({ email: userPayload.email, password: userPayload.password });

    tokens = body;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // POST /categories
  it('Create a category', async () => {
    const { statusCode, body } = await request(app)
      .post(`${baseUrl}/categories`)
      .set('Authorization', 'Bearer ' + tokens.access)
      .send(categoryPayload);

    expect(statusCode).toBe(201);
    expect(body.name).toStrictEqual(categoryPayload.name);
  });

  // GET /categories
  it('Get a Category collection', async () => {
    const { statusCode, body } = await request(app).get(
      `${baseUrl}/categories`
    );

    expect(statusCode).toBe(200);
    expect(body[0].name).toStrictEqual(categoriesPayload[0].name);
    expect(body[1].name).toStrictEqual(categoriesPayload[1].name);
  });

  // GET /categories/{id}
  it('Find category by id', async () => {
    const { statusCode, body } = await request(app).get(
      `${baseUrl}/categories/${categoryPayload.name}`
    );

    expect(statusCode).toBe(200);
    expect(body.name).toMatch(categoryPayload.name);
  });

  // PUT /categories/{id}
  it('Update whole category', async () => {
    const { statusCode, body } = await request(app)
      .put(`${baseUrl}/categories/${categoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokens.access)
      .send(updateCategoryPayload);

    expect(statusCode).toBe(200);
    expect(body.name).toStrictEqual(updateCategoryPayload.name);
  });

  // DELETE /categories/{id}
  it('Delete category', async () => {
    const { statusCode } = await request(app)
      .delete(`${baseUrl}/categories/${updateCategoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokens.access);

    expect(statusCode).toBe(204);
  });
});
