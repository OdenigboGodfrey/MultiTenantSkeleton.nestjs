import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';
import { ITenant } from '../interfaces/itenant.interface';

@Table({ tableName: 'Tenant' })
export class Tenant extends Model<Tenant> implements ITenant {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  companyName: string;
  @Index('subdomain')
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  subdomain: string;
  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
  })
  status: string;
}
