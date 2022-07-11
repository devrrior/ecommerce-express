import { Ref } from '@typegoose/typegoose';

import { User } from '../models/user.model';

interface ISession {
  _id?: string;
  user: Ref<User>;
  valid: boolean;
}

export default ISession;
