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
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateTokensInput'
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
  '/tokens',
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
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RefreshTokensInput'
 *    responses:
 *      201:
 *        description: Refresh access tokens response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateTokensResponse'
 */
router.post(
  '/tokens/refresh',
  validateResource(RefreshTokensSchema),
  refreshAccessTokensHandler
);

export default router;
