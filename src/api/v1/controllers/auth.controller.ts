import argon2 from 'argon2';
import { Request, Response } from 'express';
import { omit } from 'lodash';

import { userPrivateFields } from '../models/user.model';
import { CreateTokensType, RefreshTokensType } from '../schemas/auth.schema';
import AuthService from '../services/auth.service';
import SessionService from '../services/session.service';
import UserService from '../services/user.service';
import { verifyJWT } from '../utils/jwt';

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

  if (!user?.verified) return res.status(401).send('User not verified');

  if (!user) return res.status(401).send();

  const isValidPassword = await argon2.verify(user.password, password);

  if (!isValidPassword) return res.status(401).send();

  const userPayload = omit(user, [
    ...userPrivateFields,
    'createdAt',
    'updatedAt',
  ]);

  const tokens = await AuthService.createTokens(userPayload);

  return res.status(201).send(tokens);
};

const refreshAccessTokensHandler = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RefreshTokensType
  >,
  res: Response
) => {
  const { refresh } = req.body;

  const decoded = verifyJWT<{ session: string }>(refresh, 'refresh');

  if (!decoded) return res.status(401).send('Could not refresh access token');

  const session = await SessionService.getById(decoded.session);

  if (!session || !session.valid)
    return res.status(401).send('Could not refresh access token');

  await SessionService.patchById(session._id as string, { valid: false });

  const user = await UserService.getById(String(session.user));

  if (!user) return res.status(401).send('Could not refresh access token');

  const userPayload = omit(user, [
    ...userPrivateFields,
    'createdAt',
    'updatedAt',
  ]);

  const tokens = await AuthService.createTokens(userPayload);

  return res.status(201).send(tokens);
};

export { createTokensHandler, refreshAccessTokensHandler };
