/* eslint-disable prettier/prettier */
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString,  } from 'class-validator';


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
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  productInventory: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  productCategory: string;

  @Field(() => String)
  @IsNotEmpty()
  productUnit: string;
}