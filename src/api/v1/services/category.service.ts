import ICreateActions from '../interfaces/actions/createActions.interface';
import IEditableByNameActions from '../interfaces/actions/editableByNameAction.interface';
import IGetByNameAction from '../interfaces/actions/getByNameAction.interface';
import IListAction from '../interfaces/actions/listAction.interface';
import ICategory from '../interfaces/models/category.interface';
import CategoryModel from '../models/category.model';

class CategoryService
  implements
    IListAction<ICategory>,
    IGetByNameAction<ICategory>,
    ICreateActions<ICategory>,
    IEditableByNameActions<ICategory>
{
  async getList(limit: number, page: number): Promise<ICategory[]> {
    const categories = await CategoryModel.find({}, null, {
      sort: { update_at: -1 },
      skip: limit * page,
      limit: limit,
    });

    return categories.map((category) => category.toObject());
  }

  async getByName(name: string): Promise<ICategory | null> {
    const category = await CategoryModel.findOne({ name });

    return category ? category.toObject() : null;
  }

  async createMany(resources: ICategory[]): Promise<ICategory[]> {
    const categories = await CategoryModel.create(resources);

    return categories.map((category) => category.toObject());
  }

  async createOne(
    resource: ICategory
  ): Promise<[ICategory | null, string | null]> {
    try {
      const category = await CategoryModel.create(resource);

      return [category.toObject(), null];
    } catch (e: any) {
      return [null, 'Category not created'];
    }
  }

  async putByName(
    name: string,
    resource: ICategory
  ): Promise<ICategory | null> {
    const category = await CategoryModel.findOneAndUpdate({ name }, resource, {
      new: true,
    });

    return category ? category.toObject() : null;
  }

  async patchByName(
    name: string,
    resource: Partial<ICategory>
  ): Promise<ICategory | null> {
    const category = await CategoryModel.findByIdAndUpdate(
      { name },
      // TODO that could depends
      { $set: resource },
      { new: true }
    );

    return category ? category.toObject() : null;
  }

  async deleteByName(name: string): Promise<boolean> {
    const res = await CategoryModel.deleteOne({ name });
    return res.deletedCount === 1;
  }
}

export default new CategoryService();
