import { Router } from 'express';

import {
  createOneHandler,
  deleteOneHandler,
  getByNameHandler,
  getListHandler,
  updateOneHandler,
} from '../controllers/category.controller';
import requireAuthMiddleware from '../middlewares/requireAuth.middleware';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.get('', getListHandler);
router.get('/:name', getByNameHandler);
router.post(
  '',
  requireAuthMiddleware,
  validateResource(CreateCategorySchema),
  createOneHandler
);
router.put('/:name', updateOneHandler);
router.delete('/:name', deleteOneHandler);

export default router;
