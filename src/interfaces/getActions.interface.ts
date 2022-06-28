interface IGetActions<T> {
  list: (limit: number, page: number) => Promise<T[]>;
  readById: (id: string) => Promise<T | null>;
}

export default IGetActions;
