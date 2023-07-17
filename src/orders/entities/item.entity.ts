import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  id: string;

  @Prop()
  productName: string;

  @Prop()
  productPrice: number;

  @Prop()
  productImage: string;

  @Prop()
  quantity: number;

  @Prop()
  productUnit: string;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
ItemSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
