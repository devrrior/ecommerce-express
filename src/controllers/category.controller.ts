import { Request, Response } from 'express';

import ICategory from '../interfaces/category.interface';
import categoryService from '../services/category.service';

const listHandler = async (_: Request, res: Response) => {
  const categories = await categoryService.list(10, 0);

  res.status(200).send(categories);
};

const createOneHandler = async (req: Request, res: Response) => {
  const { name } = req.body;

  const category: ICategory = {
    name,
  };

  const categoryRes = await categoryService.createOne(category);

  res.status(201).send(categoryRes);
};

export { createOneHandler, listHandler };
