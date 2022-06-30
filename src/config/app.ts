import express from 'express';

import morganMiddleware from '../middlewares/morgan.middleware';
import routes from '../routes';

const app = express();

app.set('port', process.env.PORT || 3000);

// set middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.use(routes);

export default app;
