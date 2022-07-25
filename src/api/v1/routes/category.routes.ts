import { Router } from 'express';

import {
  createOneHandler,
  deleteOneHandler,
  getByNameHandler,
  getListHandler,
  updateOneHandler,
} from '../controllers/category.controller';
import requireAuthMiddleware from '../middlewares/requireAuth.middleware';
import restrictTo from '../middlewares/restrictTo.middleware';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.get('', getListHandler);
router.get('/:name', getByNameHandler);
router.post(
  '',
  requireAuthMiddleware,
  restrictTo('admin'),
  validateResource(CreateCategorySchema),
  createOneHandler
);
router.put(
  '/:name',
  requireAuthMiddleware,
  restrictTo('admin'),
  updateOneHandler
);
router.delete(
  '/:name',
  requireAuthMiddleware,
  restrictTo('admin'),
  deleteOneHandler
);

export default router;
