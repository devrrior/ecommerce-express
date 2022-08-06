import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { nanoid } from 'nanoid';

import IUser, { Role } from '../interfaces/models/user.interface';

export const userPrivateFields = [
  'password',
  'verificationCode',
  'verified',
  'passwordResetCode',
  '__v',
];

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User implements IUser {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ required: true })
  password: string;

  @prop({ required: true })
  verificationCode: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ enum: Role, default: Role.CUSTOMER })
  role: Role;
}

const UserModel = getModelForClass(User);

export default UserModel;
