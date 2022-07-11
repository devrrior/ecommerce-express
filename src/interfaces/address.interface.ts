import IUser from './models/user.interface';

interface IAddress {
  street: string;
  zipCode: string;
  state: string;
  country: string;
  user: IUser;
}

export default IAddress;
