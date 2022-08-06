interface ICreateActions<T> {
  createOne: (resource: T) => Promise<T | null>;
  createMany: (resources: T[]) => Promise<T[]>;
}

export default ICreateActions;
