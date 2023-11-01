import { ApiProperty } from '@nestjs/swagger';
import { ITenant } from '../interfaces/itenant.interface';

export class TenantDTO implements ITenant {
  public constructor(init?: Partial<TenantDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  subdomain: string;
  @ApiProperty()
  status: string;
}

export class NewTenantDTO {
  public constructor(init?: Partial<NewTenantDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  subdomain: string;
}
