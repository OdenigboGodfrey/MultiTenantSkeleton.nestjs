import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ignoreCaching: boolean = this.reflector.get(
      'ignoreCaching',
      context.getHandler(),
    );

    if (ignoreCaching === undefined || ignoreCaching === false) {
      if (request.method !== 'GET') {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }
}
