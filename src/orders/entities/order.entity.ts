import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as timestamp from 'mongoose-timestamp';
import { User } from '../../users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Schema()
export class Order extends mongoose.Document {
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  products: Product[];

  @Prop()
  total: number;

  @Prop()
  paymentMethod: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  seller: User;

  @Prop()
  authorizationCode: string;
}
export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.plugin(timestamp);
OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
