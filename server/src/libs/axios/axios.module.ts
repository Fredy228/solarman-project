import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Module({
  exports: [AxiosService],
  providers: [AxiosService],
})
export class AxiosModule {}
