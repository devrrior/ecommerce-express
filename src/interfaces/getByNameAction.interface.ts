interface IGetByNameAction<T> {
  getByName: (name: string) => Promise<T | null>;
}

export default IGetByNameAction;
