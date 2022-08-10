import argon2 from 'argon2';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';

import IUser from '../interfaces/models/user.interface';
import { userPrivateFields } from '../models/user.model';
import {
  CreateUserBodyType,
  ForgotPasswordBodyType,
  ResetPasswordBodyType,
  ResetPasswordParamsType,
  UpdateUserBodyType,
  UpdateUserParamsType,
  UserIdParamsType,
  VerifyUserParamsType,
} from '../schemas/user.schema';
import UserService from '../services/user.service';
import sendEmail from '../utils/mailer';

const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserBodyType>,
  res: Response
) => {
  const { email, password, firstName, lastName } = req.body;

  const VERIFICATION_TOKEN_SECRET_KEY =
    process.env.VERIFICATION_SECRET_KEY || '1234';

  const verificationCode = jwt.sign({ email }, VERIFICATION_TOKEN_SECRET_KEY);

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
    text: `Hello ${user?.firstName}, please verify your email by clicking this link: http://localhost:3000/api/v1/user/verify/${verificationCode}`,
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

const verifyUserHandler = async (
  req: Request<VerifyUserParamsType>,
  res: Response
) => {
  const { token } = req.params;

  const VERIFICATION_TOKEN_SECRET_KEY =
    process.env.VERIFICATION_SECRET_KEY || '1234';

  const decoded = jwt.verify(token, VERIFICATION_TOKEN_SECRET_KEY) as {
    email: string;
  };

  if (!decoded) return res.status(400).send();

  const user = await UserService.getByEmail(decoded.email);

  if (!user) return res.status(404).send();

  if (user.verificationCode !== token) return res.status(403).send();

  if (user.verified) return res.status(409).send();

  const updatedUser = await UserService.patchById(user._id as string, {
    verified: true,
  });

  if (!updatedUser) return res.status(500).send();

  const payload = omit(updatedUser, userPrivateFields);

  return res.status(200).send(payload);
};

const forgotPasswordHandler = async (
  req: Request<unknown, unknown, ForgotPasswordBodyType>,
  res: Response
) => {
  const message =
    'If a user with that email is registered you will receive a password reset email';

  const { email } = req.body;

  const user = await UserService.getByEmail(email);

  if (!user || !user?.verified) return res.status(200).send({ message });

  const RESET_PASSWORD_TOKEN_SECRET_KEY =
    process.env.RESET_PASSWORD_SECRET_KEY || '1234';

  const passwordResetCode = jwt.sign(
    { email },
    RESET_PASSWORD_TOKEN_SECRET_KEY,
    { expiresIn: '1h' }
  );

  const updatedUser = await UserService.patchById(user._id as string, {
    passwordResetCode,
  });

  if (!updatedUser) return res.status(500).send();

  await sendEmail({
    to: user?.email,
    from: 'test@example.com',
    subject: 'Reset your password',
    text: `Hello ${user?.firstName}, please reset your password by clicking this link: http://localhost:3000/api/v1/user/reset-password/${passwordResetCode}`,
  });

  return res.status(200).send({ message });
};

const resetPasswordHandler = async (
  req: Request<ResetPasswordParamsType, unknown, ResetPasswordBodyType>,
  res: Response
) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const RESET_PASSWORD_TOKEN_SECRET_KEY =
    process.env.RESET_PASSWORD_SECRET_KEY || '1234';

  const decoded = jwt.verify(token, RESET_PASSWORD_TOKEN_SECRET_KEY) as {
    email: string;
  };

  if (!decoded) return res.status(400).send();

  const user = await UserService.getByEmail(decoded.email);

  if (!user) return res.status(404).send();

  if (token !== user.passwordResetCode) return res.status(403).send();

  const hashPassword = await argon2.hash(newPassword);

  const updatedUser = await UserService.patchById(user._id as string, {
    password: hashPassword,
    passwordResetCode: null,
  });

  if (!updatedUser) return res.status(500).send();

  const payload = omit(updatedUser, userPrivateFields);

  return res.status(200).send(payload);
};

export {
  createUserHandler,
  deleteUserHandler,
  forgotPasswordHandler,
  getCurrentUserHandler,
  getListUserHandler,
  getUserByIdHandler,
  resetPasswordHandler,
  updateUserHandler,
  verifyUserHandler,
};
