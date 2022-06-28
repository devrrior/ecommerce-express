import { Router } from 'express';

import category from './category.routes';
import user from './user.routes';

const router = Router();

router.use('/api/v1/users', user);
router.use('/api/v1/categories', category);

export default router;
