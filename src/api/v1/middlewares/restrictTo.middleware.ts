import { NextFunction, Request, Response } from 'express';

const restrictTo =
  (...allowedRoles: string[]) =>
  (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!allowedRoles.includes(user.role)) {
      return res.status(401).send();
    }

    return next();
  };

export default restrictTo;
