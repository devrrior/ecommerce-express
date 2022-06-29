import { Request, Response } from 'express';

import ICategory from '../interfaces/category.interface';
import categoryService from '../services/category.service';

const listHandler = async (_: Request, res: Response) => {
  const categories = await categoryService.list(10, 0);

  res.status(200).send(categories);
};

const getByNameHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const categoryResponse = await categoryService.getByName(name);

  categoryResponse
    ? res.status(200).send(categoryResponse)
    : res.status(404).send();
};

const createOneHandler = async (req: Request, res: Response) => {
  const { name } = req.body;

  const category: ICategory = {
    name,
  };

  const categoryResponse = await categoryService.createOne(category);

  res.status(201).send(categoryResponse);
};

const updateOneHandler = async (req: Request, res: Response) => {
  const { name } = req.params;
  const { newName } = req.body;

  const category: ICategory = {
    name: newName,
  };

  const categoryResponse = await categoryService.putByName(name, category);

  categoryResponse
    ? res.status(200).send(categoryResponse)
    : res.status(404).send();
};

const deleteOneHandler = async (req: Request, res: Response) => {
  const { name } = req.params;

  const response = await categoryService.deleteByName(name);

  response ? res.status(204).send() : res.status(404).send();

};

export { createOneHandler, getByNameHandler, listHandler, updateOneHandler, deleteOneHandler };
