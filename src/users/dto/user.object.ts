import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/auth/enums';

@ObjectType('User')
export class UserObject {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  readonly email: string;

  @Field({ nullable: true })
  readonly firstName: string;

  @Field({ nullable: true })
  readonly lastName: string;
  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}
