/* eslint-disable prettier/prettier */
// Package
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//Emtity
import { Product } from './entities/product.entity';
//DTOs
import {
  CreateProductInput,
  UpdateProductInput,
  FetchProductArgs,
} from './dto/';
// import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { cloudinary } from 'src/cloudinary/cloudinary.config';
// @ts-ignore
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>, // private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    file: FileUpload,
  ): Promise<Product> {
  
    const imageUrl = (await this.uploadImageToCloudinary(file)) as string;

    const createInput = {
      productName: createProductInput.productName,
      productPrice: createProductInput.productPrice,
      productImage: imageUrl,
      productUnit: createProductInput.productUnit,
      productInventory: createProductInput.productInventory,
      productCategory: createProductInput.productCategory,
    } as Product;
    const product = await this.productModel.create(createInput); // Asume que estás usando TypeORM o Mongoose para crear una nueva instancia de producto
    return product;
  }

  async findAll(args?: FetchProductArgs) {
    const { offset, limit } = args;
    return await this.productModel.find().skip(offset).limit(limit);
  }
  async countProducts(){
    return await this.productModel.countDocuments();
  }

  async uploadImageToCloudinary(file) {
    return new Promise((resolve, reject) => {
      const { createReadStream, mimetype } = file;
      const cloudinaryStream = cloudinary.uploader.upload_stream( {folder: 'verduras'}, // 'verduras' es el nombre de la carpeta en cloudinary
        (error, result) => {
          if (result) {
            resolve(result.secure_url as string);
          } else {
            reject(error);
          }
        },
      );
      createReadStream().pipe(cloudinaryStream);
    });
  }
  // async uploadImageToCloudinary(file: Express.Multer.File) {
  //   return await this.cloudinaryService.uploadImage(file).catch(() => {
  //     throw new BadRequestException('Invalid file type1.');
  //   });
  // }

  // findOne(id: string) {
  //   return `This action returns a #${id} product`;
  // }

  // update(id: string, updateProductInput: UpdateProductInput) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} product`;
  // }
}

