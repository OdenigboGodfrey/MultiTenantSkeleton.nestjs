import { ResponseDTO } from './../../src/shared/dto/response.dto';

export class MockHttpRequest<T> {
  dataStore: T[] = [];

  getRequest<K>({ url }) {
    const response = new ResponseDTO<K[]>();
    response.code = '200';
    response.data = [url];
    response.message = 'ok';
    response.status = true;

    return response;
  }

  sendRequest<K>({ url, data, method }) {
    data = { ...data, ...{ url, method } };
    const response = new ResponseDTO<K>();
    response.code = '201';
    response.data = data;
    response.message = 'created';
    response.status = true;

    return response;
  }
}
