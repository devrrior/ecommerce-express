import argon2 from 'argon2';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import ITokens from '../../src/api/v1/interfaces/models/tokens.interface';
import { Role } from '../../src/api/v1/interfaces/models/user.interface';
import CategoryService from '../../src/api/v1/services/category.service';
import UserService from '../../src/api/v1/services/user.service';
import app from '../../src/config/app';

const userPayloadAdmin = {
  email: 'devrrior@gmail.com',
  password: 'fernando123',
  role: Role.ADMIN,
  firstName: 'Fernando',
  lastName: 'Guerrero',
};

const userPayloadCustomer = {
  email: 'fer@gmail.com',
  password: 'fernando123',
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

let tokensAdmin: ITokens, tokensCustomer: ITokens;

describe('/categories', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await UserService.createOne({
      ...userPayloadAdmin,
      password: await argon2.hash(userPayloadAdmin.password),
    });

    await CategoryService.createMany(categoriesPayload);

    const { body: bodyAdmin } = await request(app)
      .post(`${baseUrl}/auth/tokens`)
      .send({
        email: userPayloadAdmin.email,
        password: userPayloadAdmin.password,
      });

    tokensAdmin = bodyAdmin;

    await UserService.createOne({
      ...userPayloadCustomer,
      password: await argon2.hash(userPayloadCustomer.password),
    });

    const { body: bodyCustomer } = await request(app)
      .post(`${baseUrl}/auth/token`)
      .send({
        email: userPayloadCustomer.email,
        password: userPayloadCustomer.password,
      });

    tokensCustomer = bodyCustomer;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // POST /categories
  it('Create a category successfully', async () => {
    const { statusCode, body } = await request(app)
      .post(`${baseUrl}/categories`)
      .set('Authorization', 'Bearer ' + tokensAdmin.access)
      .send(categoryPayload);

    expect(statusCode).toBe(201);
    expect(body.name).toStrictEqual(categoryPayload.name);
  });

  it('Create a category failed', async () => {
    const { statusCode } = await request(app)
      .post(`${baseUrl}/categories`)
      .set('Authorization', 'Bearer ' + tokensCustomer.access)
      .send(categoryPayload);

    expect(statusCode).toBe(401);
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
  it('Update whole category successfully', async () => {
    const { statusCode, body } = await request(app)
      .put(`${baseUrl}/categories/${categoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokensAdmin.access)
      .send(updateCategoryPayload);

    expect(statusCode).toBe(200);
    expect(body.name).toStrictEqual(updateCategoryPayload.name);
  });

  it('Update whole category failed', async () => {
    const { statusCode } = await request(app)
      .put(`${baseUrl}/categories/${categoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokensCustomer.access)
      .send(updateCategoryPayload);

    expect(statusCode).toBe(401);
  });

  // DELETE /categories/{id}
  it('Delete category successfully', async () => {
    const { statusCode } = await request(app)
      .delete(`${baseUrl}/categories/${updateCategoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokensAdmin.access);

    expect(statusCode).toBe(204);
  });

  it('Delete category failed', async () => {
    const { statusCode } = await request(app)
      .delete(`${baseUrl}/categories/${updateCategoryPayload.name}`)
      .set('Authorization', 'Bearer ' + tokensCustomer.access);

    expect(statusCode).toBe(401);
  });
});
