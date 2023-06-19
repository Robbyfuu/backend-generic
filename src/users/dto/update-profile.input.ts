import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { UserObject } from './user.object';

@InputType()
export class UpdateProfileInput extends PartialType(
  OmitType(UserObject, ['_id'] as const, InputType),
) {}
