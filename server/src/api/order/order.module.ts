import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { ProtectAuthMiddleware } from 'src/common/middleware/auth/protect-auth.middleware';
import { KeyCrmModule } from 'src/libs/key-crm/key-crm.module';
import { TelegramModule } from 'src/libs/telegram/telegram.module';
import { OrderPublicController } from './controllers/order-public.controller';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';

@Module({
  imports: [TelegramModule, KeyCrmModule],
  controllers: [OrderPublicController, OrderController],
  providers: [OrderService],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(OrderController);
  }
}
