import { Router } from 'express';

const router = Router();

router.get('', (_, res) => res.status(200).send('hola'));

export default router;
