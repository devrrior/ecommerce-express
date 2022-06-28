interface IEditableActions<T> {
  putById: (id: string, resource: T) => Promise<T | null>;
  patchById: (id: string, resource: T) => Promise<T | null>;
  deleteById: (id: string) => Promise<boolean>;
}

export default IEditableActions;
