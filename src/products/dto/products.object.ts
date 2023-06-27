import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Product')
export class ProductObject {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly productName: string;

  @Field()
  readonly productPrice: number;

  @Field()
  readonly productImage: string;

  @Field()
  readonly productUnit: string;
}
