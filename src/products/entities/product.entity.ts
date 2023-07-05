/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as timestamp from 'mongoose-timestamp';

@Schema()
export class Product extends mongoose.Document {
  @Prop()
  productName: string;

  @Prop()
  productPrice: number;

  @Prop()
  productImage: string;

  @Prop()
  productInventory: number;

  @Prop()
  productCategory: string;

  @Prop()
  productUnit: string;

  cartQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
ProductSchema.plugin(timestamp);
