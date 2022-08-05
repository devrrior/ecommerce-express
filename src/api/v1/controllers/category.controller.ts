import { Request, Response } from 'express';
import { omit } from 'lodash';

import { categoryPrivateFields } from '../models/category.model';
import { CreateCategoryType } from '../schemas/category.schema';
import CategoryService from '../services/category.service';

const getListCategoryHandler = async (_: Request, res: Response) => {
  const categories = await CategoryService.getList(10, 0);

  const payload = categories.map((category) =>
    omit(category, categoryPrivateFields)
  );

  return res.status(200).send(payload);
};

const getCategoryByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const category = await CategoryService.getByName(name);

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const createCategoryHandler = async (
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

  return res.status(201).send(payload);
};

const updateCategoryHandler = async (req: Request, res: Response) => {
  const { name: nameParams } = req.params;
  const { name } = req.body;

  const category = await CategoryService.putByName(nameParams, { name });

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const response = await CategoryService.deleteByName(name);

  return response ? res.status(204).send() : res.status(404).send();
};

export {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoryByNameHandler,
  getListCategoryHandler,
  updateCategoryHandler,
};
