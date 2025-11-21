import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AxiosService implements OnModuleInit {
  public crmApi: AxiosInstance;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.setCrmApi();
  }

  private setCrmApi() {
    this.crmApi = axios.create({
      baseURL: this.configService.get<string>('DAILY_API_URL'),
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('DAILY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
    });
  }
}
