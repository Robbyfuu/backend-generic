import { Injectable } from '@nestjs/common';
import { CreateOrderInput, OrderProducts } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from 'src/products/products.service';
import { OrdersCounterService } from 'src/orders-counter/orders-counter.service';
import { Item } from './entities/item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly productService: ProductsService,
    private readonly ordersCounterService: OrdersCounterService,
  ) {}

  async create(createOrderInput: CreateOrderInput, userId: string) {
    createOrderInput.products.forEach((product) => {
      this.productService.updateInventory(
        product.id,
        { productInventory: product.cartQuantity },
        'sell',
      );
    });
    const nextOrderNumber =
      await this.ordersCounterService.getNextSequenceValue('orderNumber');
    const products = await this.createItem(createOrderInput.products);
    const order = await this.orderModel.create({
      seller: userId,
      products: products,
      paymentMethod: createOrderInput.paymentMethod,
      total: createOrderInput.total,
      orderNumber: nextOrderNumber,
    });

    return order;
  }
  async createItem(products: OrderProducts[]): Promise<Item[]> {
    const items: Item[] = [];
    for (const product of products) {
      const prod = await this.productService.findOne(product.id);
      const item = {
        id: prod.id,
        productName: prod.productName,
        productImage: prod.productImage,
        productPrice: prod.productPrice,
        productUnit: prod.productUnit,
        quantity: product.cartQuantity,
      };
      items.push(item);
    }
    return items;
  }

  async findAll() {
    return await this.orderModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}

