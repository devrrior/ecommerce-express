import { Request, Response } from 'express';

import ICategory from '../interfaces/category.interface';
import categoryService from '../services/category.service';

const listHandler = async (_: Request, res: Response) => {
  const categories = await categoryService.list(10, 0);

  res.status(200).send(categories);
};

const getByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  console.log(id)

  const category = await categoryService.readById(id);

  category ? res.status(200).send(category) : res.status(404).send();
};

const createOneHandler = async (req: Request, res: Response) => {
  const { name } = req.body;

  const category: ICategory = {
    name,
  };

  const categoryRes = await categoryService.createOne(category);

  res.status(201).send(categoryRes);
};

export { listHandler, getByIdHandler, createOneHandler };
