import {
  IUser,
  IChangePassword,
  IForgotPassword,
  IVerifyPasswordResetToken,
  IResetPassword,
} from '../interfaces/iuser.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserDTO implements IUser {
  public constructor(init?: Partial<UserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  id?: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  dateOfBirth: Date;
  @ApiProperty()
  status: string;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  deletedAt?: Date;
}

export type CreateUserType = Pick<
  UserDTO,
  'email' | 'phone' | 'password' | 'fullName' | 'gender'
>;

export class CreateUserDTO implements CreateUserType {
  public constructor(init?: Partial<CreateUserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
}

export class UserPasswordDTO implements IChangePassword {
  public constructor(init?: Partial<UserPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  password: string;
  newPassword: string;
}

export class EditUserDTO {
  public constructor(init?: Partial<EditUserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  homeAddress: string;
}

export class ForgotPasswordDTO implements IForgotPassword {
  public constructor(init?: Partial<ForgotPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  type: 'email' | 'phone';
}

export class VerifyPasswordResetTokenDTO implements IVerifyPasswordResetToken {
  public constructor(init?: Partial<VerifyPasswordResetTokenDTO>) {
    Object.assign(this, init);
  }
  id: number;
  token: string;
}

export class ResetPasswordDTO implements IResetPassword {
  public constructor(init?: Partial<ResetPasswordDTO>) {
    Object.assign(this, init);
  }
  id: number;
  password: string;
  token: string;
}

export class ChangePasswordDTO {
  public constructor(init?: Partial<ChangePasswordDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  password: string;
  @ApiProperty()
  oldPassword: string;
}
