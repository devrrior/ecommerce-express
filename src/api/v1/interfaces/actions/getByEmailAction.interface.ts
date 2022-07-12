interface IGetByEmailAction<T> {
  getByEmail: (emai: string) => Promise<T | null>;
}

export default IGetByEmailAction;
