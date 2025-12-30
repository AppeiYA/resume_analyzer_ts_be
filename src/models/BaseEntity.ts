export abstract class BaseEntity<T extends object> {
  constructor(props?: Partial<T>) {
    Object.assign(this, props?? {});
  }
}
