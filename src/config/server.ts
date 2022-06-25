import app from './app';
import databaseConnect from './database';

const server = app.listen(app.get('port'), () => {
  databaseConnect();

  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
