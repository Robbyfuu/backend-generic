import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductObject } from 'src/products/dto';
import { Product } from 'src/products/entities/product.entity';

@ObjectType('Order')
export class OrderObject {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly paymentMethod: string;

  @Field()
  readonly total: number;

  @Field()
  readonly createdAt: Date;

  @Field()
  readonly authorizationCode: string;

  @Field(() => [ProductObject])
  readonly products: ProductObject[];

  @Field()
  readonly updatedAt: Date;
}
