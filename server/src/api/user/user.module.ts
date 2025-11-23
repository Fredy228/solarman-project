import { Module } from '@nestjs/common';

import { HashModule } from '../../libs/hash/hash.module';
import { UserService } from './user.service';

@Module({
  imports: [HashModule],
  controllers: [],
  providers: [UserService],
})
export class UserModule {}
