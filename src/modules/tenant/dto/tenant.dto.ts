import { ApiProperty } from '@nestjs/swagger';
import { ITenant } from '../interfaces/itenant.interface';

export class TenantDTO implements ITenant {
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  subdomain: string;
  @ApiProperty()
  status: string;
}

export class NewTenantDTO {
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  subdomain: string;
}
