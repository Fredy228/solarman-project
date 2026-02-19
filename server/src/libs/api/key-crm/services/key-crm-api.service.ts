import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { TCreateLeadRequest } from '../types/create-lead-request.type';

@Injectable()
export class KeyCrmApiService {
  private logger = new Logger(KeyCrmApiService.name);
  constructor(private readonly httpService: HttpService) {}

  async createLead(data: TCreateLeadRequest): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/v1/pipelines/cards', data),
      );
      this.logger.log(`Response from KeyCRM: ${JSON.stringify(response.data)}`);
    } catch (e) {
      if (isAxiosError(e)) {
        this.logger.error(
          `Axios error: ${e.message}, Response data: ${JSON.stringify(e.response?.data)}`,
        );
      }
    }
  }
}
