import { Field, InputType } from '@nestjs/graphql';
//graphql
@InputType()
export class RefreshTokenInput {
  @Field()
  refreshToken: string;
}
