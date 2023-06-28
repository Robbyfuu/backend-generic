/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args,  } from '@nestjs/graphql';
import {  UseGuards } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

import { ProductObject, CreateProductInput, FetchProductArgs } from './dto';
import { GqlAuthGuard } from 'src/auth/guards';
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';
@Resolver(() => ProductObject)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductObject)
  @UseGuards(GqlAuthGuard)
  // @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @Args('input', { nullable: true }) createProductInput: CreateProductInput,
    @Args('file', { type: () => GraphQLUpload })
    file: FileUpload,
  ) {
    return await this.productsService.create(createProductInput, file);
  }

  @Query(() => [ProductObject], { name: 'products' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args() { offset, limit }: FetchProductArgs,
  ): Promise<Product[]> {
    return await this.productsService.findAll({ offset, limit });
  }
  @Query(() => Number, { name: 'countProducts' })
  @UseGuards(GqlAuthGuard)
  async countProducts(): Promise<number> {
    return await this.productsService.countProducts();
  }

  // @Query(() => Product, { name: 'product' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.productsService.findOne(id);
  // }

  // @Mutation(() => Product)
  // updateProduct(@Args('updateProductInput') updateProductInput: UpdateProductInput) {
  //   return this.productsService.update(updateProductInput.id, updateProductInput);
  // }

  // @Mutation(() => Product)
  // removeProduct(@Args('id', { type: () => Int }) id: number) {
  //   return this.productsService.remove(id);
  // }
}

