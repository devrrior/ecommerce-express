import argon2 from 'argon2';
import { Request, Response } from 'express';
import { omit } from 'lodash';

import { userPrivateFields } from '../models/user.model';
import { CreateTokensType } from '../schemas/auth.schema';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

const createTokensHandler = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateTokensType
  >,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await UserService.getByEmail(email);

  if (user) {
    const isValidPassword = await argon2.verify(user.password, password);
    if (isValidPassword) {
      const userPayload = omit(user, [
        ...userPrivateFields,
        'createdAt',
        'updatedAt',
      ]);
      const tokens = await AuthService.createTokens(userPayload);

      res.status(201).send(tokens);
    }
  }
  res.status(401).send();
};

export { createTokensHandler };
