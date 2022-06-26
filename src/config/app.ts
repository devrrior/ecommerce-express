import express from 'express';

import loadApiUserEndpoints from '../routes/users.routes';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


loadApiUserEndpoints(app);

export default app;
