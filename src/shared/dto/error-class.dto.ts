export interface ErrorClass<T> {
  payload: T;
  error: any;
  response: any;
}
