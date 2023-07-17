import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Item')
export class ItemObject {
  @Field(() => ID)
  id: string;
  @Field()
  productName: string;
  @Field()
  productPrice: number;

  @Field()
  productImage: string;
  @Field()
  productUnit: string;
  @Field()
  quantity: number;
}
