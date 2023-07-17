import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as timestamp from 'mongoose-timestamp';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Role } from 'src/auth/enums';

@Schema()
export class User extends mongoose.Document {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop()
  roles: Role[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  posts: mongoose.Types.ObjectId[] | Post[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken' })
  refreshTokens: mongoose.Types.ObjectId | RefreshToken;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
UserSchema.plugin(timestamp);

