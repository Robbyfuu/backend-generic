import { Module } from '@nestjs/common';
import { OrdersCounterService } from './orders-counter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Counter, CounterSchema } from './entities/order-counter.entity';

@Module({
  providers: [OrdersCounterService],
  imports: [
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
  ],
  exports: [OrdersCounterService],
})
export class OrdersCounterModule {}
