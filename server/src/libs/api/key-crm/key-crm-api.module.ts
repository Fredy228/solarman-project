import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeyCrmApiService } from './services/key-crm-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('URL_KEY_CRM'),
        headers: {
          Authorization: `Bearer ${configService.get<string>('TOKEN_KEY_CRM')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [KeyCrmApiService],
  exports: [KeyCrmApiService],
})
export class CashlessApiModule {}
