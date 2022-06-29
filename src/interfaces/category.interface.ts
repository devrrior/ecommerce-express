import IProduct from './product.interface';

interface ICategory {
  name: string;
  products?: IProduct[];
}

export default ICategory;
