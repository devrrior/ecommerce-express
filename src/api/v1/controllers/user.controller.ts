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

  const userData: IUser = {
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
    res.status(201).send(payload);
  }

  res.status(400).send();
};

const getListUserHandler = async (_: Request, res: Response) => {
  const users = await UserService.getList(5, 0);

  if (users) {
    const payload = users.map((user) => omit(user, userPrivateFields));
    res.status(200).send(payload);
  }

  res.status(404).send();
};

const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await UserService.getById(id);

  if (user) {
    const payload = omit(user, userPrivateFields);
    res.status(200).send(payload);
  }

  res.status(404).send();
};

export { createUserHandler, getListUserHandler, getUserByIdHandler };
