import { Router } from 'express';

import {
  createTokensHandler,
  refreshAccessTokensHandler,
} from '../controllers/auth.controller';
import validateResource from '../middlewares/validateResource.middleware';
import {
  CreateTokensSchema,
  RefreshTokensSchema,
} from '../schemas/auth.schema';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/tokens:
 *  post:
 *    tags:
 *      - Auth
 *    description: Create tokens
 *    parameters:
 *      - name: body
 *        in: body
 *        description: Create tokens request
 *        required: true
 *        schema:
 *          $ref: '#/components/schemas/CreateTokensInput'
 *    responses:
 *      201:
 *        description: Create tokens response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateTokensResponse'
 *      401:
 *        description: Unauthorized
 */
router.post(
  '/token',
  validateResource(CreateTokensSchema),
  createTokensHandler
);

/**
 * @openapi
 * /api/v1/auth/token/refresh:
 *  post:
 *    tags:
 *      - Auth
 *    description: Refresh access tokens
 *    parameters:
 *      - name: body
 *        in: body
 *        description: Refresh access tokens request
 *        required: true
 *        schema:
 *          $ref: '#/components/schemas/RefreshTokensInput'
 *    responses:
 *      201:
 *        description: Refresh access tokens response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateTokensResponse'
 */
router.post(
  '/token/refresh',
  validateResource(RefreshTokensSchema),
  refreshAccessTokensHandler
);

export default router;
