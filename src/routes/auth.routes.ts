import { Router } from 'express';

import { createTokensHandler } from '../controllers/auth.controller';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateTokensSchema } from '../schemas/auth.schema';

const router = Router();

router.post(
  '/token',
  validateResource(CreateTokensSchema),
  createTokensHandler
);

export default router;
