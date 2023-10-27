// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpStatus,
// } from '@nestjs/common';
// // import { RpcException } from '@nestjs/microservices';
// import { Request, Response } from 'express';

// @Catch()
// export class RpcExceptionFilter implements ExceptionFilter {
//   catch(exception: RpcException, host: ArgumentsHost) {
//     const context = host.switchToHttp();
//     const response = context.getResponse<Response>();
//     const request = context.getRequest<Request>();
//     const statusCode =
//       exception['statusCode'] ?? HttpStatus.INTERNAL_SERVER_ERROR;
//     response.statusCode = statusCode;
//     response.json({
//       name: `RPC-${exception['name']}`,
//       message: exception.message,
//       success: false,
//       code: statusCode,
//       time: new Date().toISOString(),
//     });
//   }
// }
