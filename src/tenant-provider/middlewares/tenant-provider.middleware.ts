import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { SchemaService } from './../../database-module/service/schema.service';
import { TenantService } from './../../modules/tenant/services/tenant.service';
import { ResponseDTO } from './../../shared/dto/response.dto';
import { processSubdomain } from '../utils/utils';

@Injectable()
export class TenantProviderMiddleware implements NestMiddleware {
  constructor(
    @Inject('TenantService') private readonly tenantService: TenantService,
  ) {}
  use(req, res, next) {
    const subdomain = this.extractSubdomain(req.hostname);
    this.rootDomain = process.env.ROOT_DOMAIN;
    this.tenantService
      .getTenant(subdomain)
      .then((result) => {
        if (!result.status) {
          return res.status(404).send(
            new ResponseDTO({
              code: '404',
              message: 'Tenant not found',
              status: false,
            }),
          );
        }
        SchemaService.set(processSubdomain(subdomain));
        next();
      })
      .catch((err) => {
        console.error('err', err);
        return res.status(500).send(
          new ResponseDTO({
            code: '500',
            message: 'Something went wrong, please try again.',
            status: false,
          }),
        );
      });
  }

  rootDomain: string = '';

  extractSubdomain(url: string) {
    // e.g https://localhost.xyz.com:3000
    url = url.replace('http://', '').replace('https://', '');
    // e.g localhost.xyz.com:3000
    url = url.split(':')[0];
    // e.g localhost.xyz.com = [localhost, xyz, com]
    let subdomain = url.split('.')[0];
    // e.g localhost
    subdomain = this.prepareSubdomain(subdomain);
    return subdomain;
  }

  prepareSubdomain(subdomain: string) {
    subdomain = subdomain.replace('-', '_');
    return subdomain;
  }
}
