import { Inject, Injectable } from '@nestjs/common';
import { TenantProviderService } from 'src/tenant-provider/services/tenant-provider-service';
import { Logger } from 'winston';
import { NewTenantDTO } from '../dto/tenant.dto';
import { Tenant } from '../entities/tenant.entity';
import { ResponseDTO } from 'src/shared/dto/response.dto';
import { RESPONSE_CODE } from 'src/shared/enums/response-code.enum';
import { ErrorClass } from 'src/shared/dto/error-class.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TenantRepositoryInterface } from '../repositories/tenant.repository';
import {
  PaginationParameterDTO,
  PaginationParameterResponseDTO,
} from 'src/shared/dto/pagination.dto';

@Injectable()
export class TenantService extends TenantProviderService<Tenant> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('TenantRepositoryInterface')
    protected readonly repository: TenantRepositoryInterface,
  ) {
    super(repository, Tenant);
  }

  async newTenant(payload: NewTenantDTO): Promise<ResponseDTO<Tenant>> {
    const response = new ResponseDTO<Tenant>();
    try {
      // create new schema
      const schemaCreated = await this.createSchema(payload.subdomain);
      // apply migrations on the schema
      if (schemaCreated) {
        const migrationsStatus = await this.applyMigrationsToTenant(
          payload.subdomain,
        );
        console.log(
          `Tenant [${payload.subdomain}] migration status (True/False): ${migrationsStatus}`,
        );
        // create public tenant record
        const user = await this.publicRepoInstance.create(payload);
        response.data = user;
        response.status = schemaCreated; // true;
        response.message = 'Tenant created.';
        response.code = RESPONSE_CODE._201;
      } else {
        response.status = schemaCreated;
        response.message = 'Tenant failed to be created.';
        response.code = RESPONSE_CODE._400;
      }
    } catch (e) {
      console.error(e);
      const errorObject: ErrorClass<any> = {
        payload,
        error: e['errors'],
        response: null,
      };
      response.message = 'Something went wrong, please try again.';
      response.code = RESPONSE_CODE._500;
      if (typeof e === 'object') {
        if (e['name'] === 'SequelizeUniqueConstraintError') {
          response.message =
            'Please ensure all fields are unique fields and do not exist on the system.';
          response.code = RESPONSE_CODE._409;
          errorObject.error = e['parent'];
        }
      }
      errorObject.response = response;
      this.logger.error(e.toString(), errorObject);
    }
    return response;
  }

  async getAllTenants(
    pagination: PaginationParameterDTO,
  ): Promise<ResponseDTO<PaginationParameterResponseDTO<Tenant>>> {
    const response = new ResponseDTO<PaginationParameterResponseDTO<Tenant>>();
    response.code = RESPONSE_CODE._200;
    response.message = 'No records found.';
    try {
      const paginationResponse = new PaginationParameterResponseDTO<Tenant>();
      paginationResponse.rows = [];
      response.data = paginationResponse;

      const query = pagination.buildQuery();

      const result = await pagination.fetchPaginatedRecords<Tenant>(
        this.publicRepoInstance,
        {
          query: query.where,
          sort: query.order,
        },
      );

      if (result && result.length > 0) {
        paginationResponse.rows = result;
        paginationResponse.count = await pagination.count(
          this.publicRepoInstance,
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

  async deleteTenant(schemaName: string) {
    const response = new ResponseDTO<boolean>();
    this.deleteSchema(schemaName)
      .then((result) => {
        console.log(result);
      })
      .then((err) => {
        console.error(err);
      });
    response.message = 'Tenanted delete started';
    response.code = RESPONSE_CODE._200;
    response.status = true;

    return response;
  }
}
