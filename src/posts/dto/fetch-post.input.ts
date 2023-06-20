import { Field, Int, ArgsType, ID } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class FetchPostArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  offset? = 0;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  limit? = 25;

//   @Field(() => ID, { nullable: true })
//   author?: string;

//   @Field(() => ID, { nullable: true })
//   id?: string;
}
