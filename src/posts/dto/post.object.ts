import { Field, ID, ObjectType } from '@nestjs/graphql';

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
