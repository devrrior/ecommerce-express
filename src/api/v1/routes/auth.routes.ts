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

router.post(
  '/token',
  validateResource(CreateTokensSchema),
  createTokensHandler
);
router.post(
  '/token/refresh',
  validateResource(RefreshTokensSchema),
  refreshAccessTokensHandler
);

export default router;
