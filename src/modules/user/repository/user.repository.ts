import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '../../../repositories/base/base.abstract.repository';
import { User } from '../entities/user.entity';
import { BaseInterfaceRepository } from '../../../repositories/base/base.interface.repository';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor() {
    super();
  }
}
