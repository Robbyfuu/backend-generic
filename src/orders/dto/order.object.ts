import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { ProductObject } from 'src/products/dto';

@ObjectType('Order')
export class OrderObject {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly paymentMethod: string;

  @Field(() => Int)
  readonly orderNumber: number;

  @Field()
  readonly total: number;

  @Field()
  readonly createdAt: Date;

  @Field(() => String, { nullable: true })
  readonly authorizationCode: string;

  @Field(() => [ProductObject])
  readonly products: ProductObject[];

  @Field()
  readonly updatedAt: Date;
}
