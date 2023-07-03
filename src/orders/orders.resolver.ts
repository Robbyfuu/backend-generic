import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput, OrderObject, UpdateOrderInput } from './dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards';
import { GqlCurrentUser } from 'src/auth/decorator/gql-current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ProductObject } from 'src/products/dto';
import { UserObject } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';

@Resolver(() => OrderObject)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => OrderObject)
  @UseGuards(GqlAuthGuard)
  createOrder(
    @GqlCurrentUser() user: User,
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [OrderObject], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => OrderObject, { name: 'order' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => OrderObject)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => OrderObject)
  removeOrder(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.remove(id);
  }
  @ResolveField(() => ProductObject)
  async products(@Parent() order: Order) {
    return order.products;
  }
  @ResolveField(() => UserObject)
  async author(@Parent() order: Order) {
    if (order.seller) {
      return this.usersService.findOne({ id: order.seller.toString() });
    }
    return await this.usersService.findOne({ postId: order.id });
  }
}
