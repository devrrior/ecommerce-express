import { Router } from 'express';

import {
  createOneHandler,
  listHandler,
} from '../controllers/category.controller';

const router = Router();

router.get('', listHandler);
router.post('', createOneHandler);

export default router;
