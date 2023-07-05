import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  @IsNotEmpty()
  paymentMethod: string;

  @Field(() => Int)
  @IsNotEmpty()
  total: number;

  @Field(() => [OrderProducts])
  @IsNotEmpty()
  products: [OrderProducts];

  @Field(() => String, { nullable: true })
  authorizationCode?: string;
}

@InputType()
class OrderProducts {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  cartQuantity: number;
}
