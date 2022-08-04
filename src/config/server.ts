import logger from '../api/v1/utils/logger';
import swaggerDocs from '../api/v1/utils/swagger';
import app from './app';
import databaseConnect from './database';

const server = app.listen(app.get('port'), async () => {
  await databaseConnect();

  logger.info(
    `App is running at http://localhost:${app.get('port')} in ${app.get(
      'env'
    )} mode`
  );

  swaggerDocs(app, app.get('port'));
  logger.info('Press CTRL-C to stop\n');
});

export default server;
