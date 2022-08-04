import argon2 from 'argon2';
import { Request, Response } from 'express';
import { omit } from 'lodash';

import IUser from '../interfaces/models/user.interface';
import { userPrivateFields } from '../models/user.model';
import { CreateUserType } from '../schemas/user.schema';
import UserService from '../services/user.service';

const createUserHandler = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateUserType
  >,
  res: Response
) => {
  const { email, password, firstName, lastName } = req.body;

  const userData: Pick<IUser, 'email' | 'password' | 'firstName' | 'lastName'> =
    {
      email,
      password,
      firstName,
      lastName,
    };

  const hashPassword = await argon2.hash(userData.password);

  userData.password = hashPassword;

  const user = await UserService.createOne(userData);

  if (user) {
    const payload = omit(user, userPrivateFields);
    return res.status(201).send(payload);
  }

  return res.status(400).send();
};

const getListUserHandler = async (_: Request, res: Response) => {
  const users = await UserService.getList(5, 0);

  if (users) {
    const payload = users.map((user) => omit(user, userPrivateFields));
    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send();

  const user = await UserService.getById(id);

  if (!user) return res.status(404).send();

  const payload = omit(user, userPrivateFields);
  return res.status(200).send(payload);
};

const getCurrentUserHandler = async (_: Request, res: Response) => {
  const user = res.locals.user;

  return res.status(200).send(omit(user, userPrivateFields));
};

export {
  createUserHandler,
  getCurrentUserHandler,
  getListUserHandler,
  getUserByIdHandler,
};
