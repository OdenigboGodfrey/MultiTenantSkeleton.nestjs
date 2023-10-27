import { Injectable, NestMiddleware } from '@nestjs/common';
import { SchemaService } from 'src/database-module/service/schema.service';

@Injectable()
export class TenantProviderMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log('Request received:', req.method, req.originalUrl, req.host);
    const subdomain = this.extractSubdomain(req.host);
    SchemaService.set(subdomain);
    next();
  }

  extractSubdomain(url: string) {
    url = url.replace('http://', '').replace('https://', '');
    url = url.split(':')[0];
    let subdomain = url.split('.')[0];
    subdomain = this.prepareSubdomain(subdomain);
    return subdomain;
  }

  prepareSubdomain(subdomain: string) {
    subdomain = subdomain.replace('-', '_');
    return subdomain;
  }
}
