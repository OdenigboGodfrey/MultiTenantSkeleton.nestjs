import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
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
import { NewTenantDTO, TenantDTO } from '../dto/tenant.dto';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { TenantService } from '../services/tenant.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {
  PaginationParameterDTO,
  PaginationParameterRequestDTO,
  PaginationParameterResponseDTO,
} from 'src/shared/dto/pagination.dto';

@Controller('tenant')
@ApiTags('tenant')
export class TenantController {
  constructor(private readonly service: TenantService) {}

  @ApiOperation({
    description: 'register new tenant',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: TenantDTO,
  })
  @Post('/new')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: NewTenantDTO })
  async create(@Body() data: NewTenantDTO): Promise<ResponseDTO<TenantDTO>> {
    const response = await this.service.newTenant(data);
    return response.getResponse();
  }

  @ApiOperation({
    description: 'get all users',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json')
  @ApiResponse({
    type: TenantDTO,
    isArray: true,
  })
  @Get('/get-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async fetch(
    @Query() pagination: PaginationParameterRequestDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<TenantDTO>>> {
    const result = await this.service.getAllTenants(
      new PaginationParameterDTO(pagination),
    );
    const response = new ResponseDTO<PaginationParameterResponseDTO<TenantDTO>>(
      {
        status: result.status,
        message: result.message,
        code: result.code,
      },
    );
    response.data = new PaginationParameterResponseDTO<TenantDTO>({
      count: result.data.count,
      totalPages: result.data.totalPages,
    });
    if (result.data.rows) {
      response.data.rows = result.data.rows.map((x) => x.dataValues);
    }
    return response.getResponse();
  }

  @ApiOperation({
    description: 'remove tenant',
  })
  @ApiProduces('json')
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiResponse({
    type: Boolean,
  })
  @Delete('/remove')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: NewTenantDTO })
  async remove(): Promise<ResponseDTO<boolean>> {
    const response = await this.service.deleteTenant();
    return response.getResponse();
  }
}
