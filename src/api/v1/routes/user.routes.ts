import { Router } from 'express';

import {
  createUserHandler,
  getListUserHandler,
  getUserByIdHandler,
} from '../controllers/user.controller';
import validateResource from '../middlewares/validateResource.middleware';
import { CreateUserSchema } from '../schemas/user.schema';

const router = Router();

router.post('', validateResource(CreateUserSchema), createUserHandler);
router.get('', getListUserHandler);
router.get('/:id', getUserByIdHandler);

export default router;
