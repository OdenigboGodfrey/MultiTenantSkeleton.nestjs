import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  Param,
  // UseInterceptors,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ResponseDTO } from '../../../shared/dto/response.dto';
import {
  ChangePasswordDTO,
  EditUserDTO,
  UserDTO,
  CreateUserDTO,
} from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  PaginationParameterDTO,
  PaginationParameterRequestDTO,
  PaginationParameterResponseDTO,
} from '../../../shared/dto/pagination.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    description: 'Create a account',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: UserDTO,
  })
  @Post('/create')
  @ApiBody({ type: CreateUserDTO })
  async create(@Body() data: CreateUserDTO): Promise<ResponseDTO<UserDTO>> {
    const userObject = new UserDTO(data);
    const response = await this.service.createUser(userObject);
    data.password = '';
    return response.getResponse();
  }

  @ApiOperation({
    description: 'get all users',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: UserDTO,
    isArray: true,
  })
  @Get('/get-all-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUsers(
    @Query() pagination: PaginationParameterRequestDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<UserDTO>>> {
    const result = await this.service.getAllUsers(
      new PaginationParameterDTO(pagination),
    );
    const response = new ResponseDTO<PaginationParameterResponseDTO<UserDTO>>({
      status: result.status,
      message: result.message,
      code: result.code,
    });
    response.data = new PaginationParameterResponseDTO<UserDTO>({
      count: result.data.count,
      totalPages: result.data.totalPages,
    });
    if (result.data.rows) {
      response.data.rows = result.data.rows.map((x) =>
        this.service.newUserDTO(x),
      );
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'update a profile',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Patch('/update-profile')
  @ApiBody({ type: EditUserDTO })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @Body() data: EditUserDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    const user = await this.service.getUserById(data.id);
    if (!user.status) {
      response.status = user.status;
      response.data = user.status;
      response.message = user.message;
      response.code = user.code;
      return response.getResponse();
    }
    const updateResponse = await this.service.updateProfile(user.data, data);
    return updateResponse.getResponse();
  }

  @ApiOperation({
    description: 'update a user password',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Patch('/update-password/:id')
  @ApiBody({ type: ChangePasswordDTO })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(
    @Body() data: ChangePasswordDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    const user = await this.service.getUserById(data.id);
    if (!user.status) {
      response.status = user.status;
      response.data = user.status;
      response.message = user.message;
      response.code = user.code;
      return response.getResponse();
    }
    const updateResponse = await this.service.changePassword(
      user.data,
      data.oldPassword,
      data.password,
    );
    return updateResponse.getResponse();
  }

  @ApiOperation({
    description: 'get user by id',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: UserDTO,
  })
  @Get('/get-user-by-id/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserById(@Param('id') id: number): Promise<ResponseDTO<UserDTO>> {
    const result = await this.service.getUserById(id);
    const response = new ResponseDTO<UserDTO>();
    response.message = result.message;
    response.code = result.code;
    response.message = result.message;
    response.status = result.status;
    if (result.status) {
      response.data = result.data;
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'delete account',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: Boolean,
  })
  @Delete('/delete-account/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteAccount(
    @Param('userId') userId: number,
  ): Promise<ResponseDTO<boolean>> {
    const result = await this.service.getUserById(userId);
    const response = new ResponseDTO<boolean>();
    response.message = result.message;
    response.code = result.code;
    response.message = result.message;
    response.status = result.status;
    if (result.status) {
      // delete profile
      this.service.delete(result.data);
      response.message = 'Profile deleted';
      response.data = null;
    }
    return response.getResponse();
  }
}
