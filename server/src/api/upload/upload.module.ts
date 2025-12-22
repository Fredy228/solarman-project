import { MiddlewareConsumer, Module } from '@nestjs/common';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { FileModule } from '../../libs/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(UploadController);
  }
}
