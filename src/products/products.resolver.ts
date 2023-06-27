/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { createWriteStream } from 'fs';
// import { CreateProductInput } from './dto/create-product.input';
// import { UpdateProductInput } from './dto/update-product.input';
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
    console.log('entre1');
    console.log();
    // const file = createReadStream().pipe(
    //   createWriteStream(`./uploads/${filename}`),
    // );
    return await this.productsService.create(createProductInput, file);
  }

  @Query(() => [ProductObject], { name: 'products' })
  @UseGuards(GqlAuthGuard)
  async findAll(
    @Args() { offset, limit }: FetchProductArgs,
  ): Promise<Product[]> {
    return await this.productsService.findAll({ offset, limit });
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

