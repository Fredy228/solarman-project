import { Module, type MiddlewareConsumer } from '@nestjs/common';

import { ProtectAuthMiddleware } from 'src/common/middleware/auth/protect-auth.middleware';
import { HashModule } from '../../libs/hash/hash.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HashModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(UserController);
  }
}
