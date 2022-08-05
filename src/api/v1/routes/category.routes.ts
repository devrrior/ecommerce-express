import { Router } from 'express';

import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoryByNameHandler,
  getListCategoryHandler,
  updateCategoryHandler,
} from '../controllers/category.controller';
import requireAuthMiddleware from '../middlewares/requireAuth.middleware';
import restrictTo from '../middlewares/restrictTo.middleware';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateCategorySchema } from '../schemas/category.schema';

const router = Router();

/**
 * @openapi
 * /api/v1/categories:
 *  get:
 *    tags:
 *      - Categories
 *    description: Get all categories
 *    responses:
 *      200:
 *        description: A list of categories
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CreateCategoryResponse'
 */
router.get('', getListCategoryHandler);

/**
 * @openapi
 * /api/v1/categories/{name}:
 *  get:
 *    tags:
 *      - Categories
 *    description: Get a category by name
 *    parameters:
 *      - name: name
 *        in: path
 *        description: Name of the category
 *        required: true
 *        schema:
 *          type: string
 *          example: "Clothes"
 *    responses:
 *      200:
 *        description: A category
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCategoryResponse'
 *      404:
 *        description: Category not found
 */
router.get('/:name', getCategoryByNameHandler);

/**
 * @openapi
 * /api/v1/categories:
 *  post:
 *    tags:
 *      - Categories
 *    description: Create a category
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateCategoryInput'
 *    responses:
 *      201:
 *        description: Category created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCategoryResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.post(
  '',
  requireAuthMiddleware,
  restrictTo('admin'),
  validateResource(CreateCategorySchema),
  createCategoryHandler
);

/**
 * @openapi
 * /api/v1/categories/{name}:
 *  put:
 *    tags:
 *      - Categories
 *    description: Update a category
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: name
 *        in: path
 *        description: Name of the category
 *        required: true
 *        schema:
 *          type: string
 *          example: "Clothes"
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateCategoryInput'
 *    responses:
 *      200:
 *        description: Category updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateCategoryResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Category not found
 */
router.put(
  '/:name',
  requireAuthMiddleware,
  restrictTo('admin'),
  updateCategoryHandler
);

/**
 * @openapi
 * /api/v1/categories/{name}:
 *  delete:
 *    tags:
 *      - Categories
 *    description: Delete a category
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: name
 *        in: path
 *        description: Name of the category
 *        required: true
 *        schema:
 *        type: string
 *        example: "Clothes"
 *    responses:
 *      204:
 *        description: Category deleted
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Category not found
 */
router.delete(
  '/:name',
  requireAuthMiddleware,
  restrictTo('admin'),
  deleteCategoryHandler
);

export default router;
