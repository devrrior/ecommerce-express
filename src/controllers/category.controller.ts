import { Request, Response } from 'express';

import ICategory from '../interfaces/category.interface';
import { CreateCategoryType } from '../schemas/category.schema';
import CategoryService from '../services/category.service';

const listHandler = async (_: Request, res: Response) => {
  const categories = await CategoryService.list(10, 0);

  res.status(200).send(categories);
};

const getByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const categoryResponse = await CategoryService.getByName(name);

  categoryResponse
    ? res.status(200).send(categoryResponse)
    : res.status(404).send();
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

  const category: ICategory = {
    name,
  };

  const categoryResponse = await CategoryService.createOne(category);

  res.status(201).send(categoryResponse);
};

const updateOneHandler = async (req: Request, res: Response) => {
  const { name: nameParams } = req.params;
  const { name } = req.body;

  const category: ICategory = {
    name,
  };

  const categoryResponse = await CategoryService.putByName(
    nameParams,
    category
  );

  categoryResponse
    ? res.status(200).send(categoryResponse)
    : res.status(404).send();
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
  listHandler,
  updateOneHandler,
};
