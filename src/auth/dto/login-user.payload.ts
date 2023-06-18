import { Field, ObjectType } from '@nestjs/graphql';
import { UserObject } from '../../users/dto/user.object';
//graphql
@ObjectType()
export class LoginUserPayload {
  @Field(() => UserObject)
  user: UserObject;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
