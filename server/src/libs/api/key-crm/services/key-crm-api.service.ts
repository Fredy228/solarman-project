import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { TCreateLeadRequest } from '../types/create-lead-request.type';
import { externalApiRoutes } from '../../../../configs/external-api-routes.config';

@Injectable()
export class KeyCrmApiService {
  private logger = new Logger(KeyCrmApiService.name);

  private readonly baseURL: string | null;
  private readonly token: string | null;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseURL = this.configService.get<string>('URL_KEY_CRM') || null;
    this.token = this.configService.get<string>('TOKEN_KEY_CRM') || null;
  }

  private checkConfig(): boolean {
    if (!this.baseURL) return false;
    if (!this.token) return false;
    return true;
  }

  async sendLead(data: TCreateLeadRequest): Promise<void> {
    if (!this.checkConfig()) {
      this.logger.warn('Skipping KeyCRM API call due to missing configuration');
      return;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(externalApiRoutes.keyCrm.lead, data),
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
