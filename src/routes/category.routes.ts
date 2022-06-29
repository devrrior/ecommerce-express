import { Router } from 'express';

import {
  createOneHandler,
  getByNameHandler,
  listHandler,
  updateOneHandler,
  deleteOneHandler,
} from '../controllers/category.controller';

const router = Router();

router.get('', listHandler);
router.get('/:name', getByNameHandler);
router.post('', createOneHandler);
router.put('/:name', updateOneHandler);
router.delete('/:name', deleteOneHandler);

export default router;
