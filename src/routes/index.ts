import { Router } from 'express';
import user from './user.routes';
import category from './category.routes';

const router = Router();

router.use('/api/v1/users', user)
router.use('/api/v1/categories', category);


export default router;
