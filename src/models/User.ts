import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
  @prop()
  first_name: string;

  @prop()
  last_name: string;

  @prop()
  password: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
