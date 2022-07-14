import 'dotenv/config';

import express, { json, urlencoded } from 'express';

import morganMiddleware from '../api/v1/middlewares/morgan.middleware';
import routes from '../api/v1/routes';

const app = express();

app.set('port', process.env.PORT || 3000);

// set middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morganMiddleware);

app.use(routes);

export default app;
