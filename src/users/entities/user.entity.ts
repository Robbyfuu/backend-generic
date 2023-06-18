import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken' })
  refreshTokens: mongoose.Types.ObjectId | RefreshToken;
}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   transform: function (_doc, ret) {
//     delete ret._id;
//   },
// });
