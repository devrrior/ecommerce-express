import { Application, Response } from 'express';

const loadApiUserEndpoints = (app: Application): void => {
  app.get('/api/v1/users', (_, res: Response) => {
    return res.status(200).send('hola');
  });
};

export default loadApiUserEndpoints;
