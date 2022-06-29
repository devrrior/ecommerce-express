import IProduct from './product.interface';

interface ICategory {
  _id?: string;
  name: string;
  products?: IProduct[];
  __v?: number;
}

export default ICategory;
