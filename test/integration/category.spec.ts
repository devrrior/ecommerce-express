import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/config/app';
import CategoryService from '../../src/services/category.service';

const categoriesPayload = [
  {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Health',
  },
  {
    id: new mongoose.Types.ObjectId().toString(),
    name: 'Sport',
  },
];

describe('GET /categories', () => {
  beforeAll(async () => {
    // connect to mongodb
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // POST /categories
  it('Get a Category collection', async () => {
    const categories = CategoryService.createMany(categoriesPayload);
    const { statusCode, body } = await request(app).get('/api/v1/categories');

    expect(statusCode).toBe(200);
    expect(body).toBe(categories);
  });

  // GET /categories

  // GET /categories/{id}

  // PUT /categories/{id}

  // DELETE /categories/{id}
});
