import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthUserDTO, UserLoginDTO } from '../dto/auth.dto';
import { ResponseDTO } from '../../../shared/dto/response.dto';
import { UserDTO } from '../../user/dtos/user.dto';
// import { GoogleAuthenticationService } from './services/googleauth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    description: 'Login a user',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: AuthUserDTO,
  })
  @Post('/login')
  @HttpCode(200)
  async loginWithPasscode(
    @Body() payload: UserLoginDTO,
  ): Promise<ResponseDTO<AuthUserDTO | UserDTO>> {
    const user = await this.service.fetchUserFromDB(
      payload.login,
      payload.password,
    );
    if (!user.status) {
      return user.getResponse();
    }

    const userDTO = this.service.userDTO(user.data);
    const result = await this.service.generateJWT(userDTO);
    if (result.status) {
      result.data.user = userDTO;
    }
    return result.getResponse();
  }
}
