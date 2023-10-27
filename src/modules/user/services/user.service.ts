import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../entities/user.entity';
import { EditUserDTO, UserDTO } from '../dtos/user.dto';
import { ResponseDTO } from './../../../shared/dto/response.dto';
import { RESPONSE_CODE } from './../../../shared/enums/response-code.enum';
import { ErrorClass } from './../../../shared/dto/error-class.dto';
import * as bcrypt from 'bcrypt';
import { saltRounds } from './../../../shared/utils';
import {
  PaginationParameterDTO,
  PaginationParameterResponseDTO,
} from './../../../shared/dto/pagination.dto';
import { UserRepositoryInterface } from '../repository/user.repository';
import { TenantProviderService } from 'src/tenant-provider/services/tenant-provider-service';

@Injectable()
export class UserService extends TenantProviderService<User> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('UserRepositoryInterface')
    readonly repository: UserRepositoryInterface,
  ) {
    super(repository, User);
  }

  public newUserDTO(user: User): UserDTO {
    return { ...user.dataValues };
  }

  async createUser(payload: UserDTO): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      // const user = await this.repository.create(User, payload);
      const user = await this.tenantRepoInstance.create(payload);
      response.data = user;
      response.status = true;
      response.message = 'User account created.';
      response.code = RESPONSE_CODE._201;
    } catch (e) {
      console.error(e);
      const errorObject: ErrorClass<UserDTO> = {
        payload,
        error: e['errors'],
        response: null,
      };
      response.message = 'Something went wrong, please try again.';
      response.code = RESPONSE_CODE._500;
      if (typeof e === 'object') {
        if (e['name'] === 'SequelizeUniqueConstraintError') {
          response.message =
            'Please ensure email or phone has not been used to open an existing account.';
          response.code = RESPONSE_CODE._409;
          errorObject.error = e['parent'];
        }
      }
      errorObject.response = response;
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getAllUsers(
    pagination: PaginationParameterDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<User>>> {
    const response = new ResponseDTO<PaginationParameterResponseDTO<User>>();
    response.code = RESPONSE_CODE._200;
    response.message = 'No records found.';
    try {
      const paginationResponse = new PaginationParameterResponseDTO<User>();
      paginationResponse.rows = [];
      response.data = paginationResponse;

      const query = pagination.buildQuery();

      const result = await pagination.fetchPaginatedRecords<User>(
        this.tenantRepoInstance,
        {
          query: query.where,
          sort: query.order,
        },
      );

      if (result && result.length > 0) {
        paginationResponse.rows = result;
        paginationResponse.count = await pagination.count(
          this.tenantRepoInstance,
          query.where,
        );
        paginationResponse.totalPages = pagination.totalPages({
          count: paginationResponse.count,
        });
        response.data = paginationResponse;
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.message = 'Records fetched.';
      }
    } catch (e) {
      console.error('function', e);
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserByLoginAndPassword(
    login: string,
    password: string,
  ): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.tenantRepoInstance.findOne({
        where: { email: login },
      });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User not found.';
        return response;
      } else {
        if (await bcrypt.compareSync(password, result.dataValues.password)) {
          response.status = true;
          response.code = RESPONSE_CODE._200;
          response.data = result;
        } else {
          response.code = RESPONSE_CODE._404;
          response.message = 'User not found.';
          return response;
        }
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserByEmail(email: string): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.tenantRepoInstance.findOne({
        where: { email },
      });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User with the supplied email not found.';
        return response;
      } else {
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.data = result;
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getUserById(id: number): Promise<ResponseDTO<User>> {
    const response = new ResponseDTO<User>();
    try {
      const result = await this.tenantRepoInstance.findOne({ where: { id } });
      response.status = false;
      if (!result) {
        response.code = RESPONSE_CODE._404;
        response.message = 'User id not found .';
        return response;
      } else {
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.data = result;
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updatePassword(
    user: User,
    password: string,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      // update password
      this.tenantRepoInstance.update(
        {
          password: hashedPassword,
        },
        { where: { id: user.id } },
      );
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async updateProfile(
    user: User,
    payload: EditUserDTO,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // write otp
      this.tenantRepoInstance.update(payload, { where: { id: user.id } });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<EditUserDTO> = {
        payload: payload,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async changePassword(
    user: User,
    oldPassword: string,
    password: string,
  ): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      if (await bcrypt.compareSync(oldPassword, user.dataValues.password)) {
        this.updatePassword(user, password);
        response.status = true;
        response.code = RESPONSE_CODE._200;
        response.data = true;
      } else {
        response.code = RESPONSE_CODE._400;
        response.message = 'old Password incorrect.';
      }
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async delete(user: User): Promise<ResponseDTO<boolean>> {
    const response = new ResponseDTO<boolean>();
    response.data = false;
    try {
      // update password
      this.tenantRepoInstance.destroy({ where: { id: user.id } });
      response.status = true;
      response.code = RESPONSE_CODE._200;
      response.data = true;
    } catch (e) {
      response.message = 'An error occurred.';
      response.extra_data = e.toString();
      response.code = RESPONSE_CODE._500;
      const errorObject: ErrorClass<any> = {
        payload: null,
        error: e['errors'],
        response: response,
      };
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }
}
