import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  paymentMethod: string;

  @Field(() => Int)
  @IsNotEmpty()
  total: number;

  @Field(() => [Product])
  @IsNotEmpty()
  products: Product[];

  @Field(() => String, { nullable: true })
  authorizationCode?: string;
}
