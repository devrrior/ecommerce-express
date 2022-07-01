interface IGetByIdAction<T> {
  getById: (id: string) => Promise<T | null>;
}

export default IGetByIdAction;
