import { Request, Response } from 'express';
import { omit } from 'lodash';

import { categoryPrivateFields } from '../models/category.model';
import { CreateCategoryType } from '../schemas/category.schema';
import CategoryService from '../services/category.service';

const getListHandler = async (_: Request, res: Response) => {
  const categories = await CategoryService.getList(10, 0);

  const payload = categories.map((category) =>
    omit(category, categoryPrivateFields)
  );

  res.status(200).send(payload);
};

const getByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const category = await CategoryService.getByName(name);

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    res.status(200).send(payload);
  }

  res.status(404).send();
};

const createOneHandler = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    CreateCategoryType
  >,
  res: Response
) => {
  const { name } = req.body;

  const category = await CategoryService.createOne({ name });

  const payload = omit(category, categoryPrivateFields);

  res.status(201).send(payload);
};

const updateOneHandler = async (req: Request, res: Response) => {
  const { name: nameParams } = req.params;
  const { name } = req.body;

  const category = await CategoryService.putByName(nameParams, { name });

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    res.status(200).send(payload);
  }

  res.status(404).send();
};

const deleteOneHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const response = await CategoryService.deleteByName(name);

  response ? res.status(204).send() : res.status(404).send();
};

export {
  createOneHandler,
  deleteOneHandler,
  getByNameHandler,
  getListHandler,
  updateOneHandler,
};
