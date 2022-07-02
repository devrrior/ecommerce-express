import { getModelForClass, prop } from '@typegoose/typegoose';

import ICategory from '../interfaces/category.interface';

export const categoryPrivateFields = ['__v'];

class Category implements ICategory {
  @prop({ required: true, lowercase: true, unique: true })
  name: string;
}

const CategoryModel = getModelForClass(Category);

export default CategoryModel;
