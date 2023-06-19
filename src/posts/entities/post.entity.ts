import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import * as timestamp from 'mongoose-timestamp';

@Schema()
export class Post extends mongoose.Document {
  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(timestamp);
PostSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
