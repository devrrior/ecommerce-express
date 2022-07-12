import IGetByIdAction from '../interfaces/actions/getByIdAction.interface';
import ISession from '../interfaces/models/session.interface';
import SessionModel from '../models/session.model';

class SessionService implements IGetByIdAction<ISession> {
  async getById(id: string): Promise<ISession | null> {
    const session = await SessionModel.findById(id);

    return session ? session.toObject() : null;
  }

  async patchById(
    id: string,
    resource: Partial<ISession>
  ): Promise<ISession | null> {
    const session = await SessionModel.findByIdAndUpdate(id, resource, {
      new: true,
    });

    return session ? session.toObject() : null;
  }
}

export default new SessionService();
