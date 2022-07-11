import IProduct from '../product.interface';

interface ICategory {
  _id?: string;
  name: string;
  products?: IProduct[];
}

export default ICategory;
