import ICreateActions from '../interfaces/createActions.interface';
import IEditableByIdActions from '../interfaces/editableByIdActions.interface';
import IGetByIdAction from '../interfaces/getByIdAction.interface';
import IListAction from '../interfaces/listAction.interface';
import IUser from '../interfaces/user.interface';
import UserModel from '../models/user.model';

class UserService
  implements
    IListAction<IUser>,
    IGetByIdAction<IUser>,
    ICreateActions<IUser>,
    IEditableByIdActions<IUser>
{
  async list(limit: number, page: number): Promise<IUser[]> {
    return UserModel.find({}, null, {
      sort: { update_at: -1 },
      skip: limit * page,
      limit: limit,
    });
  }

  async getById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async createOne(resource: IUser): Promise<IUser> {
    return UserModel.create(resource);
  }

  async createMany(resources: IUser[]): Promise<IUser[]> {
    return UserModel.create(resources);
  }

  async putById(id: string, resource: IUser): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, resource, { new: true });
  }

  async patchById(id: string, resource: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, resource, { new: true });
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await UserModel.deleteOne({ id });
    return res.deletedCount === 1;
  }
}

export default new UserService();
