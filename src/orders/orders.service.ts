import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './entities/order.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from 'src/products/products.service';
import { OrdersCounterService } from 'src/orders-counter/orders-counter.service';

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
    const productIds = createOrderInput.products.map(
      (product) => new Types.ObjectId(product.id),
    );
    const order = await this.orderModel.create({
      seller: userId,
      products: productIds,
      paymentMethod: createOrderInput.paymentMethod,
      total: createOrderInput.total,
      orderNumber: nextOrderNumber,
    });

    // await order.save();
    return order;
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

