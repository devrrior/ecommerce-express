import { NextFunction, Request, Response } from 'express';

import IAccessToken from '../interfaces/accessToken.interface';
import UserService from '../services/user.service';
import { verifyJWT } from '../utils/jwt';

const requireAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || '').replace(
    /^Bearer\s/,
    ''
  );

  if (!accessToken) return res.status(401).send();

  const decoded: IAccessToken | null = verifyJWT(accessToken, 'access');

  if (!decoded) return res.status(401).send();

  const user = await UserService.getById(decoded._id);

  if (user === null) return res.status(401).send();

  res.locals.user = user;

  return next();
};

export default requireAuthMiddleware;
