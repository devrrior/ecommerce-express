import { Router } from 'express';

import {
  createOneHandler,
  deleteOneHandler,
  getByNameHandler,
  listHandler,
  updateOneHandler,
} from '../controllers/category.controller';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.get('', listHandler);
router.get('/:name', getByNameHandler);
router.post('', validateResource(CreateCategorySchema), createOneHandler);
router.put('/:name', updateOneHandler);
router.delete('/:name', deleteOneHandler);

export default router;
