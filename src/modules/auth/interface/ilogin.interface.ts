export interface IUserLogin {
  login: string;
  password: string;
}

export interface ICreateUser {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  termsAgreed: boolean;
  phoneNoVerified: boolean;
  gender: string;
  bvn: string;
  dateOfBirth: Date;
  homeAddress: string;
  passCode: string;
}
