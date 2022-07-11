import IAddress from '../address.interface';

interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verified?: boolean;
  role?: Role;
  addresses?: IAddress[];
}

export enum Role {
  admin,
  customer,
}

export default IUser;
