interface IGetByEmail<T> {
  getByEmail: (emai: string) => Promise<T | null>;
}

export default IGetByEmail;
