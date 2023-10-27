/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const { message, name } = exception;
    const errorResponse = exception['response'];
    const statusCode = errorResponse
      ? errorResponse['statusCode']
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.statusCode = statusCode;
    response.json({
      success: false,
      code: statusCode,
      time: new Date().toISOString(),
      message,
      name,
    });
  }
}
