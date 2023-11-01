import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { UserDTO } from '../user/dtos/user.dto';
import { jwtConstants } from './constants';
import { SchemaService } from 'src/database-module/service/schema.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (!auth) {
      throw new UnauthorizedException(
        new ResponseDTO<any>({
          status: false,
          code: '401',
          message: 'Missing authentication',
        }),
      );
    }
    const result = auth.split(' ');
    if (result.length > 1) {
      const sentToken = auth.replace('Bearer ', '');

      const payload: UserDTO = await this.jwtService
        .verifyAsync(sentToken, {
          secret: jwtConstants.getSecret(),
        })
        .catch(() => {
          throw new UnauthorizedException(
            new ResponseDTO<any>({
              status: false,
              code: '401',
              message: 'Unauthorized. Access token is invalid.',
            }),
          );
        });

      // check auth request is on the appropraite subdomain
      if (payload['tenant'] != SchemaService.get()) {
        throw new UnauthorizedException(
          new ResponseDTO<any>({
            status: false,
            code: '401',
            message: 'Unauthorized. Invalid access token.',
          }),
        );
      }

      console.log('payload', payload);
      request.user = payload;
    } else {
      throw new UnauthorizedException(
        new ResponseDTO<any>({
          status: false,
          code: '401',
          message: 'Unauthorized. Invalid access token.',
        }),
      );
    }

    return true;
  }
}
