import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema()
export class RefreshToken extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: User;
  @Prop({ type: Boolean })
  revoked = false;
  @Prop()
  expires: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
