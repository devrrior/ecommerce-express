import ICategory from '../interfaces/category.interface';
import ICreateActions from '../interfaces/createActions.interface';
import IEditableActions from '../interfaces/editableActions.interface';
import IGetActions from '../interfaces/getActions.interface';
import CategoryModel from '../models/category.model';

class CategoryService
  implements
    IGetActions<ICategory>,
    ICreateActions<ICategory>,
    IEditableActions<ICategory>
{
  async list(limit: number, page: number): Promise<ICategory[]> {
    return CategoryModel.find({}, null, {
      sort: { update_at: -1 },
      skip: limit * page,
      limit: limit,
    });
  }

  async readById(id: string): Promise<ICategory | null> {
    return CategoryModel.findById(id);
  }

  async createMany(resources: ICategory[]): Promise<ICategory[]> {
    return CategoryModel.insertMany(resources);
  }

  async createOne(resource: ICategory): Promise<ICategory> {
    return CategoryModel.create(resource);
  }

  async putById(id: string, resource: ICategory): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate({ id }, resource, { new: true });
  }

  async patchById(id: string, resource: ICategory): Promise<ICategory | null> {
    return CategoryModel.findByIdAndUpdate(
      { id },
      // that could depends
      { $set: resource },
      { new: true }
    );
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await CategoryModel.deleteOne({ id });
    return res.deletedCount === 1;
  }
}

export default new CategoryService();
