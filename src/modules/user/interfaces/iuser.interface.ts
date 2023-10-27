export interface IUser {
  id?: number;
  email: string;
  phone: string;
  password: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
  status: string;
}

export interface IChangePassword {
  id: number;
  password: string;
  newPassword: string;
}

export interface IEditUser {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date;
  id: number;
}

export interface IForgotPassword {
  id: number;
  type: 'phone' | 'email';
}

export interface IVerifyPasswordResetToken {
  id: number;
  token: string;
}

export interface IResetPassword {
  id: number;
  password: string;
  token: string;
}
