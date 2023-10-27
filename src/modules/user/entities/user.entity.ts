import {
  Table,
  Column,
  Model,
  DataType,
  BeforeCreate,
  Index,
} from 'sequelize-typescript';
import { IUser } from '../interfaces/iuser.interface';
import * as bcrypt from 'bcrypt';
import { saltRounds } from './../../../shared/utils';

@Table({ tableName: 'User' })
export class User extends Model<User> implements IUser {
  @Index('user-email')
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  phone: string;
  @Column(DataType.STRING)
  password: string;
  @Column(DataType.STRING)
  fullName: string;
  @Column({
    type: DataType.ENUM,
    values: ['male', 'female', 'other'],
    allowNull: true,
  })
  gender: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth: Date;
  @Column({
    type: DataType.STRING,
    defaultValue: 'active',
  })
  status: string;

  @BeforeCreate
  static onModelCreating(user: User) {
    user.dataValues.password = bcrypt.hashSync(
      user.dataValues.password,
      saltRounds,
    );
  }
}
