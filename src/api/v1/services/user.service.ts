import ICreateActions from '../interfaces/actions/createActions.interface';
import IEditableByIdActions from '../interfaces/actions/editableByIdActions.interface';
import IGetByEmailAction from '../interfaces/actions/getByEmailAction.interface';
import IGetByIdAction from '../interfaces/actions/getByIdAction.interface';
import IListAction from '../interfaces/actions/listAction.interface';
import IUser from '../interfaces/models/user.interface';
import UserModel from '../models/user.model';

class UserService
  implements
    IListAction<IUser>,
    IGetByIdAction<IUser>,
    IGetByEmailAction<IUser>,
    ICreateActions<IUser>,
    IEditableByIdActions<IUser>
{
  async getList(limit: number, page: number): Promise<IUser[]> {
    const users = await UserModel.find({}, null, {
      sort: { update_at: -1 },
      skip: limit * page,
      limit: limit,
    });

    return users.map((user) => user.toObject());
  }

  async getById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);

    return user ? user.toObject() : null;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });

    return user ? user.toObject() : null;
  }

  async createOne(resource: IUser): Promise<IUser> {
    const user = await UserModel.create(resource);

    return user.toObject();
  }

  async createMany(resources: IUser[]): Promise<IUser[]> {
    const users = await UserModel.create(resources);

    return users.map((user) => user.toObject());
  }

  async putById(id: string, resource: IUser): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, resource, { new: true });

    return user ? user.toObject() : null;
  }

  async patchById(id: string, resource: Partial<IUser>): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(id, resource, { new: true });

    return user ? user.toObject() : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await UserModel.deleteOne({ id });
    return res.deletedCount === 1;
  }
}

export default new UserService();
