import morgan from 'morgan';
import logger from '../utils/logger';

const stream = {
  write: (message: string) => logger.http(message),
};

const morganMiddleware = morgan(
  (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      // tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  },
  { stream }
);

export default morganMiddleware;
