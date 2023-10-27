/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestInterceptorLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const user = request.user; // Assuming you have a strategy that populates the user object in the request

    // if (user) {}

    return next.handle().pipe(
      tap(() => {
        // You can also log the response information here if needed
      }),
    );
  }
}

// in provider, add
// {
//     provide: APP_INTERCEPTOR,
//     useClass: RequestInterceptorLogger,
//   },
