import { getModelForClass, prop } from '@typegoose/typegoose';

import ICategory from '../interfaces/category.interface';

class Category implements ICategory {
  @prop({ required: true, lowercase: true })
  name: string;
}

const CategoryModel = getModelForClass(Category);

export default CategoryModel;
