import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

export class ResponseDTO<T> {
  public constructor(init?: Partial<ResponseDTO<T>>) {
    Object.assign(this, init);
  }
  status = false;
  // data: T;
  data: T = null;
  message = '';
  extra_data: any[] = [];
  code = '400';
  getResponse() {
    if (this.code != '200' && this.code != '201') this.data = null;
    switch (this.code) {
      case '201':
      case '200':
        return this;
      case '500':
        this.data = null;
        throw new InternalServerErrorException(this);
      case '404':
        this.data = null;
        throw new NotFoundException(this);
      case '409':
        this.data = null;
        throw new ConflictException(this);
      case '401':
        this.data = null;
        throw new UnauthorizedException(this);
      case '403':
        this.data = null;
        throw new ForbiddenException(this);
      default:
        throw new BadRequestException(this);
    }
  }
}
