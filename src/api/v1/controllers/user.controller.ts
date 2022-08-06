import argon2 from 'argon2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';

import IUser from '../interfaces/models/user.interface';
import { userPrivateFields } from '../models/user.model';
import {
  CreateUserBodyType,
  UpdateUserBodyType,
  UpdateUserParamsType,
  UserIdParamsType,
} from '../schemas/user.schema';
import UserService from '../services/user.service';
import sendEmail from '../utils/mailer';

const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserBodyType>,
  res: Response
) => {
  const { email, password, firstName, lastName } = req.body;

  const VERIFICATION_TOKEN_SECRET_KEY = process.env.JWT_SECRET_KEY || '1234';

  const verificationCode = await jwt.sign(
    { email },
    VERIFICATION_TOKEN_SECRET_KEY,
    {
      expiresIn: '1d',
    }
  );

  const userData: Pick<
    IUser,
    'email' | 'password' | 'firstName' | 'lastName' | 'verificationCode'
  > = {
    email,
    password,
    firstName,
    lastName,
    verificationCode,
  };

  const hashPassword = await argon2.hash(userData.password);

  userData.password = hashPassword;

  const [user, error] = await UserService.createOne(userData);

  if (error && error.includes('Email'))
    return res.status(409).send({ message_error: error });

  if (error && error.includes('User'))
    return res.status(500).send({ message_error: error });

  const payload = omit(user, userPrivateFields);

  await sendEmail({
    to: user?.email,
    from: 'test@example.com',
    subject: 'Welcome to our app. Verify your email',
    text: `Hello ${user?.firstName}, please verify your email by clicking this link: http://localhost:3000/verify/${verificationCode}`,
  });

  return res.status(201).send(payload);
};

const getListUserHandler = async (_: Request, res: Response) => {
  const users = await UserService.getList(5, 0);

  if (users) {
    const payload = users.map((user) => omit(user, userPrivateFields));
    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const getUserByIdHandler = async (
  req: Request<UserIdParamsType>,
  res: Response
) => {
  const { id } = req.params;

  const user = await UserService.getById(id);

  if (!user) return res.status(404).send();

  const payload = omit(user, userPrivateFields);
  return res.status(200).send(payload);
};

const getCurrentUserHandler = async (_: Request, res: Response) => {
  const user = res.locals.user;

  return res.status(200).send(omit(user, userPrivateFields));
};

const updateUserHandler = async (
  req: Request<UpdateUserParamsType, unknown, UpdateUserBodyType>,
  res: Response
) => {
  const { id } = req.params;
  const userData = req.body;
  const currentUser: IUser = res.locals.user;

  const user = await UserService.patchById(id, userData);

  if (!user) return res.status(404).send();

  if (user.email !== currentUser.email) return res.status(403).send();

  const payload = omit(user, userPrivateFields);

  return res.status(200).send(payload);
};

const deleteUserHandler = async (
  req: Request<UserIdParamsType>,
  res: Response
) => {
  const { id } = req.params;
  const currentUser: IUser = res.locals.user;

  const user = await UserService.getById(id);

  if (!user) return res.status(404).send();

  if (user?.email !== currentUser.email) return res.status(403).send();

  const checkIfUserWasDeleted = await UserService.deleteById(id);

  if (!checkIfUserWasDeleted) return res.status(500).send();

  return res.status(204).send();
};

export {
  createUserHandler,
  deleteUserHandler,
  getCurrentUserHandler,
  getListUserHandler,
  getUserByIdHandler,
  updateUserHandler,
};
