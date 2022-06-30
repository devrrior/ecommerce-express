import logger from '../utils/logger';
import app from './app';
import databaseConnect from './database';

const server = app.listen(app.get('port'), () => {
  databaseConnect();

  logger.info(
    `App is running at http://localhost:${app.get('port')} in ${app.get(
      'env'
    )} mode`
  );

  logger.info('Press CTRL-C to stop\n');
});

export default server;
