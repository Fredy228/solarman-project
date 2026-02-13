import { Module, type MiddlewareConsumer } from '@nestjs/common';
import { ProtectAuthMiddleware } from 'src/common/middleware/auth/protect-auth.middleware';
import { OrderPublicController } from './controllers/order-public.controller';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';

@Module({
  controllers: [OrderController, OrderPublicController],
  providers: [OrderService],
  exports: [],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(OrderController);
  }
}
