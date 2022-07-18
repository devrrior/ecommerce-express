import IAddress from '../address.interface';

interface IUser {
  _id?: string;
  email: string;
  password: string;
  passwordResetCode: string | null;
  firstName: string;
  lastName: string;
  verified: boolean;
  verificationCode: string;
  role?: Role;
  addresses?: IAddress[];
}

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export default IUser;
