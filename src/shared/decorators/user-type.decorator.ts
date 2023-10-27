import { SetMetadata } from '@nestjs/common';

export const UserType = (userTypes: string[]) =>
  SetMetadata('user-type', userTypes);
