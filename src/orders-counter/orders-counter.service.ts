import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter } from './entities/order-counter.entity';

@Injectable()
export class OrdersCounterService {
  constructor(@InjectModel(Counter.name) private counterModel: Model<Counter>) {
    this.init();
  }

  async init(): Promise<void> {
    const counter = await this.counterModel.findOne({ name: 'orderNumber' });
    if (!counter) {
      await this.counterModel.create({
        name: 'orderNumber',
        sequence_value: 0,
      });
    }
  }
  async getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequenceDocument = await this.counterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { sequence_value: 1 } },
      { new: true },
    );

    return sequenceDocument.sequence_value;
  }
}
