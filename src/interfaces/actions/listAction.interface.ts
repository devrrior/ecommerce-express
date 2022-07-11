interface IListAction<T> {
  getList: (limit: number, page: number) => Promise<T[]>;
}

export default IListAction;
