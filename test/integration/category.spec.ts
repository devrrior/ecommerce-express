import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/config/app';
import CategoryService from '../../src/services/category.service';

const categoryPayload = {
  name: 'technology',
};

const categoriesPayload = [
  {
    name: 'health',
  },
  {
    name: 'sport',
  },
];

describe('/categories', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].drop();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // POST /categories
  it('Create a category', async () => {
    const { statusCode, body } = await request(app)
      .post('/api/v1/categories')
      .send(categoryPayload);

    expect(statusCode).toBe(201);
    expect(body.name).toStrictEqual(categoryPayload.name);
  });

  // GET /categories
  test('Get a Category collection', async () => {
    const responseCategoryService = await CategoryService.createMany(
      categoriesPayload
    );
    const { statusCode, body } = await request(app).get('/api/v1/categories');

    expect(statusCode).toBe(200);
    expect(body[0].name).toStrictEqual(responseCategoryService[0].name);
    expect(body[1].name).toStrictEqual(responseCategoryService[1].name);
  });

  // GET /categories/{id}
  test('Find category by id', async () => {
    await CategoryService.createOne(categoryPayload);

    const { statusCode, body } = await request(app).get(
      `/api/v1/categories/${categoryPayload.name}`
    );

    expect(statusCode).toBe(200);
    expect(body.name).toMatch(categoryPayload.name);
  });

  // PUT /categories/{id}
  test('Update whole category', async () => {
    await CategoryService.createOne(categoryPayload);
    const updateCategoryPayload = {
      newName: 'electronic',
    };

    const { statusCode, body } = await request(app)
      .put(`/api/v1/categories/${categoryPayload.name}`)
      .send(updateCategoryPayload);

    expect(statusCode).toBe(200);
    expect(body.name).toStrictEqual(updateCategoryPayload.newName);
  });

  // DELETE /categories/{id}
  test('Delete category', async () => {
    await CategoryService.createOne(categoryPayload);
    const { statusCode } = await request(app).delete(
      `/api/v1/categories/${categoryPayload.name}`
    );

    expect(statusCode).toBe(204);
  });
});
