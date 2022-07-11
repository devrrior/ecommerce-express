import { Router } from 'express';

import auth from './auth.routes';
import category from './category.routes';
import user from './user.routes';

const router = Router();

router.use('/api/v1/users', user);
router.use('/api/v1/categories', category);
router.use('/api/v1/auth', auth);

export default router;
