interface ICreateActions<T> {
  createOne: (resource: T) => Promise<T>;
  createMany: (resources: T[]) => Promise<T[]>;
}

export default ICreateActions;
