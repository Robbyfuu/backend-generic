import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType('Post')
export class PostObject {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly title: string;

  @Field()
  readonly body: string;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly updatedAt: Date;
}