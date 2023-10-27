// import { Auth } from "googleapis";
import { ResponseDTO } from './../../../shared/dto/response.dto';

export interface IAuthentication {
  authenticate(token: string): Promise<ResponseDTO<any>>;
}
