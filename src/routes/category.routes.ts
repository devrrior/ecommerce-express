import { Router } from 'express';

import {
  listHandler,
  getByIdHandler,
  createOneHandler,
} from '../controllers/category.controller';

const router = Router();

router.get('', listHandler);
router.get('/:id', getByIdHandler);
router.post('', createOneHandler);

export default router;
