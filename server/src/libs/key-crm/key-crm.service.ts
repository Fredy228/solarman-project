import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { KeyCrmApiService } from '../api/key-crm/services/key-crm-api.service';
import { TCreateLeadRequest } from '../api/key-crm/types/create-lead-request.type';

@Injectable()
export class KeyCrmService {
  private readonly sources: Map<string, number>;

  constructor(
    private readonly configService: ConfigService,
    private readonly keyCrmApiService: KeyCrmApiService,
  ) {
    const sourcesConfig = this.configService.get<string>('SOURCES_KEY_CRM');
    this.sources = new Map<string, number>(
      sourcesConfig
        ? sourcesConfig.split(',').map((item) => {
            const [name, id] = item.split(':');
            return [name.trim(), Number(id.trim())];
          })
        : [],
    );
  }

  createLead(data: Omit<TCreateLeadRequest, 'source_id'>) {
    const preparedData: TCreateLeadRequest = {
      ...data,
      source_id: this.sources.get(data.utm_source || '') || undefined,
    };
    return this.keyCrmApiService.sendLead(preparedData);
  }
}
