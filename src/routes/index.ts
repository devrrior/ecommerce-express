import { Router} from 'express';
import user from './user.routes';

const routes = Router();

routes.use('/api/v1/users', user)


export default routes;
