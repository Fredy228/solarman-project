import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ProtectAuthMiddleware } from '../../common/middleware/auth/protect-auth.middleware';
import { HashtagPublicController } from './controllers/hashtag-public.controller';
import { HashtagController } from './controllers/hashtag.controller';
import { HashtagPublicService } from './services/hashtag-public.service';
import { HashtagService } from './services/hashtag.service';

@Module({
  providers: [HashtagService, HashtagPublicService],
  controllers: [HashtagPublicController, HashtagController],
})
export class HashtagModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(HashtagController);
  }
}
