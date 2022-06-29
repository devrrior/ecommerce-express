import ICategory from '../interfaces/category.interface';
import ICreateActions from '../interfaces/createActions.interface';
import IEditableByNameActions from '../interfaces/editableByNameAction.interface';
import IGetByNameAction from '../interfaces/getByNameAction.interface';
import IListAction from '../interfaces/listAction.interface';
import CategoryModel from '../models/category.model';

class CategoryService
  implements
    IListAction<ICategory>,
    IGetByNameAction<ICategory>,
    ICreateActions<ICategory>,
    IEditableByNameActions<ICategory>
{
  async list(limit: number, page: number): Promise<ICategory[]> {
    return CategoryModel.find({}, null, {
      sort: { update_at: -1 },
      skip: limit * page,
      limit: limit,
    });
  }

  async getByName(name: string): Promise<ICategory | null> {
    return CategoryModel.findOne({ name });
  }

  async createMany(resources: ICategory[]): Promise<ICategory[]> {
    return CategoryModel.insertMany(resources);
  }

  async createOne(resource: ICategory): Promise<ICategory> {
    return CategoryModel.create(resource);
  }

  async putByName(
    name: string,
    resource: ICategory
  ): Promise<ICategory | null> {
    return CategoryModel.findOneAndUpdate({ name }, resource, { new: true });
  }

  async patchByName(
    name: string,
    resource: Partial<ICategory>
  ): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate(
      { name },
      // TODO that could depends
      { $set: resource },
      { new: true }
    );
  }

  async deleteByName(name: string): Promise<boolean> {
    const res = await CategoryModel.deleteOne({ name });
    return res.deletedCount === 1;
  }
}

export default new CategoryService();
