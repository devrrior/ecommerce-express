import { Router } from 'express';

import {
  createUserHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  getListUserHandler,
  getUserByIdHandler,
  resetPasswordHandler,
  updateUserHandler,
  verifyUserHandler,
} from '../controllers/user.controller';
import requireAuthMiddleware from '../middlewares/requireAuth.middleware';
import validateResource from '../middlewares/validateResource.middleware';
import {
  CreateUserSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
  UserIdSchema,
  VerifyUserSchema,
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

/**
 * @openapi
 * /api/v1/users/{id}:
 *  put:
 *    tags:
 *      - Users
 *    description: Update user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of the user
 *        required: true
 *        schema:
 *          type: string
 *          example: 507f191e810c19729de860ea
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UpdateUserInput'
 *    responses:
 *      200:
 *        description: Update user response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateUserResponse'
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: User not found
 */
router.put(
  '/:id',
  requireAuthMiddleware,
  validateResource(UpdateUserSchema),
  updateUserHandler
);

/**
 * @openapi
 * /api/v1/users/{id}:
 *  delete:
 *    tags:
 *      - Users
 *    description: Delete user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of the user
 *        required: true
 *        schema:
 *          type: string
 *          example: 507f191e810c19729de860ea
 *    responses:
 *      204:
 *        description: Delete user response
 *      404:
 *        description: User not found
 */
router.delete(
  '/:id',
  requireAuthMiddleware,
  validateResource(UserIdSchema),
  deleteUserHandler
);

/**
 * @openapi
 * /api/v1/users/verify/{token}:
 *  post:
 *    tags:
 *      - Users
 *    description: Verify user
 *    parameters:
 *      - name: token
 *        in: path
 *        description: Token of the user
 *        required: true
 *        schema:
 *          type: string
 *          example: 507f191e810c19729de860ea
 *    responses:
 *      200:
 *        description: Verify user response
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: User not found
 *      409:
 *        description: Conflict
 */
router.post(
  '/verify/:token',
  validateResource(VerifyUserSchema),
  verifyUserHandler
);

/**
 * @openapi
 * /api/v1/users/forgot-password:
 *  post:
 *    tags:
 *      - Users
 *    description: Forgot password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: john@email.com
 *    responses:
 *      200:
 *        description: Forgot password response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: If a user with that email is registered you will receive a password reset email
 */
router.post(
  '/forgot-password',
  validateResource(ForgotPasswordSchema),
  forgotPasswordHandler
);

/**
 * @openapi
 * /api/v1/users/reset-password/{token}:
 *  post:
 *    tags:
 *      - Users
 *    description: Reset password
 *    parameters:
 *      - name: token
 *        in: path
 *        description: Token of the user
 *        required: true
 *        schema:
 *          type: string
 *          example: 507f191e810c19729de860ea
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *                example: 12345678
 *              newPasswordConfirmation:
 *                type: string
 *                example: 12345678
 *    responses:
 *      200:
 *       description: Reset password response
 *      400:
 *        description: Bad request
 *      403:
 *        description: Forbidden
 *      404:
 *        description: User not found
 */
router.post(
  '/reset-password/:token',
  validateResource(ResetPasswordSchema),
  resetPasswordHandler
);

export default router;
