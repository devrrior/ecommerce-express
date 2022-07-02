import { Request, Response } from 'express';

import IUser from '../interfaces/user.interface';
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

  const user: IUser = {
    email,
    password,
    firstName,
    lastName,
  };

  const userResponese = await UserService.createOne(user);

  if (userResponese) {
    res.status(201).send(userResponese);
  }

  res.status(400).send();
};

const getUserByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const userResponese = await UserService.getById(id);

  if (userResponese) {
    res.status(200).send(userResponese);
  }

  res.status(404).send();
};

export { createUserHandler, getUserByIdHandler };
