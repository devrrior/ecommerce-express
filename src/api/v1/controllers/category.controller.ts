import { Request, Response } from 'express';
import { omit } from 'lodash';

import { categoryPrivateFields } from '../models/category.model';
import {
  CategoryNameParamsType,
  CreateCategoryBodyType,
  UpdateCategoryBodyType,
  UpdateCategoryParamsType,
} from '../schemas/category.schema';
import CategoryService from '../services/category.service';

const getListCategoryHandler = async (_: Request, res: Response) => {
  const categories = await CategoryService.getList(10, 0);

  const payload = categories.map((category) =>
    omit(category, categoryPrivateFields)
  );

  return res.status(200).send(payload);
};

const getCategoryByNameHandler = async (
  req: Request<CategoryNameParamsType>,
  res: Response
) => {
  const { name } = req.params;

  const category = await CategoryService.getByName(name);

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const createCategoryHandler = async (
  req: Request<unknown, unknown, CreateCategoryBodyType>,
  res: Response
) => {
  const { name } = req.body;

  const [category, error] = await CategoryService.createOne({ name });

  if (error) return res.status(409).send({ message_error: error });

  const payload = omit(category, categoryPrivateFields);

  return res.status(201).send(payload);
};

const updateCategoryHandler = async (
  req: Request<UpdateCategoryParamsType, unknown, UpdateCategoryBodyType>,
  res: Response
) => {
  const { name: nameParams } = req.params;
  const { name } = req.body;

  const category = await CategoryService.putByName(nameParams, { name });

  if (category) {
    const payload = omit(category, categoryPrivateFields);

    return res.status(200).send(payload);
  }

  return res.status(404).send();
};

const deleteCategoryHandler = async (
  req: Request<CategoryNameParamsType>,
  res: Response
) => {
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
