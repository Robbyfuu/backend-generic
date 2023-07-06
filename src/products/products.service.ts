// Package
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';

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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  async countProducts() {
    return await this.productModel.countDocuments();
  }

  async uploadImageToCloudinary(file: FileUpload) {
    return new Promise((resolve, reject) => {
      const { createReadStream, mimetype } = file;
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        { folder: 'verduras' }, // 'verduras' es el nombre de la carpeta en cloudinary
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

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
  async getProductsByIds(productIds: Product[]): Promise<Product[]> {
    const products = await this.productModel
      .find({ _id: { $in: productIds } })
      .exec();
    return products;
  }

  async update(id: string, updateProductInput: UpdateProductInput) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.set(updateProductInput);
    return product.save();
  }

  async updateInventory(
    id: string,
    updateProductInput: UpdateProductInput,
    typeOperation: string,
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    // ver el inventario actual
    const currentInventory = product.productInventory;
    if (typeOperation === 'add') {
      const newInventory =
        currentInventory + updateProductInput.productInventory;
      product.set({ productInventory: newInventory });
    } else if (typeOperation === 'sell') {
      const newInventory =
        currentInventory - updateProductInput.productInventory;
      product.set({ productInventory: newInventory });
    }
    return product.save();
  }
  // remove(id: string) {
  //   return `This action removes a #${id} product`;
  // }
}
