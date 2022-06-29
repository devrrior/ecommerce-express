interface IEditableByNameActions<T> {
  putByName: (name: string, resource: T) => Promise<T | null>;
  patchByName: (name: string, resource: Partial<T>) => Promise<T | null>;
  deleteByName: (name: string) => Promise<boolean>;
}

export default IEditableByNameActions;
