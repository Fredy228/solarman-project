import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { FileModule } from '../../libs/file/file.module';
import { BlogPublicController } from './controllers/blog-public.controller';
import { BlogController } from './controllers/blog.controller';
import { BlogPublicService } from './services/blog-public.service';
import { BlogService } from './services/blog.service';

@Module({
  imports: [FileModule],
  controllers: [BlogController, BlogPublicController],
  providers: [BlogPublicService, BlogService],
})
export class BlogModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(BlogController);
  }
}
