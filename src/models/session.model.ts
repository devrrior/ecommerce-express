import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import ISession from '../interfaces/session.interface';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
class Session implements ISession {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ default: true })
  valid: boolean;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;
