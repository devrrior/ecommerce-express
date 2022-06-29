interface IListAction<T> {
  list: (limit: number, page: number) => Promise<T[]>;
}

export default IListAction;
