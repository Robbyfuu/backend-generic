/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';


@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  productName: string;
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  productPrice: number;

  // @Field(() => UploadScalar)
  // productImage: string;

  @Field(() => String)
  @IsNotEmpty()
  productUnit: string;
}