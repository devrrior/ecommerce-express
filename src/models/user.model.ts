import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from '@typegoose/typegoose';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';

import IUser, { Role } from '../interfaces/user.interface';
import logger from '../utils/logger';

export const userPrivateFields = [
  'password',
  'verificationCode',
  'verified',
  'passwordResetCode',
  '__v',
];

@pre<User>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
class User implements IUser {
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

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: Role.customer })
  role: Role;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      logger.error('Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
