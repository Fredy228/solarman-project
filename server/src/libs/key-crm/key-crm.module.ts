import { Module } from '@nestjs/common';
import { KeyCrmApiModule } from '../api/key-crm/key-crm-api.module';
import { KeyCrmService } from './key-crm.service';

@Module({
  imports: [KeyCrmApiModule],
  providers: [KeyCrmService],
  exports: [KeyCrmService],
})
export class KeyCrmModule {}
