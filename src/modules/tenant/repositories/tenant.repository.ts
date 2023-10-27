import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';
import { Tenant } from '../entities/tenant.entity';

export type TenantRepositoryInterface = BaseInterfaceRepository<Tenant>;

@Injectable()
export class TenantRepository
  extends BaseAbstractRepository<Tenant>
  implements TenantRepositoryInterface
{
  constructor() {
    super();
  }
}
