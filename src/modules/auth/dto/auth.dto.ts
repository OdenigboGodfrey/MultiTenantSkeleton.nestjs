import { ApiProperty } from '@nestjs/swagger';
import { IUserLogin } from '../interface/ilogin.interface';
import { UserDTO } from './../../../modules/user/dtos/user.dto';

export class UserLoginDTO implements IUserLogin {
  public constructor(init?: Partial<UserLoginDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty({
    required: true,
  })
  login: string;
  @ApiProperty({
    required: true,
  })
  password: string;
}

export class AuthUserDTO {
  public constructor(init?: Partial<AuthUserDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  token: string;
  @ApiProperty()
  user?: UserDTO;
}

export class VerifyOTPDTO {
  public constructor(init?: Partial<VerifyOTPDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
}

export class ResetForgotPasswordDTO {
  public constructor(init?: Partial<ResetForgotPasswordDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
  @ApiProperty()
  password: string;
}

export class GoogleAuthDTO {
  public constructor(init?: Partial<GoogleAuthDTO>) {
    Object.assign(this, init);
  }
  @ApiProperty()
  email: string;
  @ApiProperty()
  googleAccessToken: string;
  @ApiProperty()
  googleId: string;
}
