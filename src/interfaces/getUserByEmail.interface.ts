interface IGetUserByEmail<T> {
  getUserByEmail: (email: string) => Promise<T | null>;
}

export default IGetUserByEmail;
