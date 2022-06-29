import { Router } from 'express';

import {
  createOneHandler,
  getByNameHandler,
  listHandler,
} from '../controllers/category.controller';

const router = Router();

router.get('', listHandler);
router.get('/:name', getByNameHandler);
router.post('', createOneHandler);

export default router;
