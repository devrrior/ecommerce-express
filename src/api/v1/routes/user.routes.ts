import { Router } from 'express';

import {
  createUserHandler,
  deleteUserHandler,
  getCurrentUserHandler,
  getListUserHandler,
  getUserByIdHandler,
  updateUserHandler,
} from '../controllers/user.controller';
import requireAuthMiddleware from '../middlewares/requireAuth.middleware';
import validateResource from '../middlewares/validateResource.middleware';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserIdSchema,
} from '../schemas/user.schema';

const router = Router();

/**
 * @openapi
 * /api/v1/users:
 *  post:
 *    tags:
 *      - Users
 *    description: Create user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *    responses:
 *      201:
 *        description: Create user response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      400:
 *        description: Bad request
 */
router.post('', validateResource(CreateUserSchema), createUserHandler);

/**
 * @openapi
 * /api/v1/users:
 *  get:
 *    tags:
 *      - Users
 *    description: Get list user
 *    responses:
 *      200:
 *        description: A list of users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CreateUserResponse'
 */
router.get('', getListUserHandler);

/**
 * @openapi
 * /api/v1/users/me:
 *  get:
 *    tags:
 *      - Users
 *    description: Get current user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: A user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      401:
 *        description: Unauthorized
 */
router.get('/me', requireAuthMiddleware, getCurrentUserHandler);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  get:
 *    tags:
 *      - Users
 *    description: Get user by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of the user
 *        required: true
 *        schema:
 *          type: string
 *          example: 507f191e810c19729de860ea
 *    responses:
 *      200:
 *        description: A user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      404:
 *        description: User not found
 */
router.get('/:id', validateResource(UserIdSchema), getUserByIdHandler);

router.put(
  '/:id',
  requireAuthMiddleware,
  validateResource(UpdateUserSchema),
  updateUserHandler
);

router.delete(
  '/:id',
  requireAuthMiddleware,
  validateResource(UserIdSchema),
  deleteUserHandler
);

export default router;
