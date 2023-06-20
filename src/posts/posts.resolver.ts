// Packages
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
// Services
import { UsersService } from 'src/users/users.service';
import { PostsService } from './posts.service';
//Decorators
import { GqlCurrentUser } from '../auth/decorator/gql-current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
// Entities
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
// DTOs
import { UserObject } from '../users/dto/user.object';
import {
  FetchPostArgs,
  PostObject,
  CreatePostInput,
  UpdatePostInput,
} from './dto';

@Resolver(() => PostObject)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private usersService: UsersService,
  ) {}

  @Query(() => [PostObject])
  async posts(
    @Args() { offset, limit }: FetchPostArgs,
    @Args('authorId', { nullable: true }) authorId: string,
  ): Promise<Post[]> {
    return this.postsService.findAll({ offset, limit });
  }
  @Query(() => [PostObject])
  async postsByAuthorId(
    @Args('authorId', { type: () => ID }) authorId: string,
  ): Promise<Post[]> {
    return this.postsService.findAllByAuthorId(authorId);
  }

  @Query(() => PostObject)
  async post(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.findOne(id);
  }
  @Query(() => [PostObject])
  @UseGuards(GqlAuthGuard)
  async myPosts(@GqlCurrentUser() user: User) {
    return this.postsService.findAllByAuthorId(user.id);
  }

  @Mutation(() => PostObject)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @GqlCurrentUser() user: User,
    @Args('input') input: CreatePostInput,
  ) {
    console.log('user', typeof user.id);
    return await this.postsService.create(user.id, input);
  }

  @Mutation(() => PostObject)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @GqlCurrentUser() user: User,
    @Args('input') input: UpdatePostInput,
  ) {
    const post = await this.postsService.findOne(input.id);
    if (post.author.id !== user.id) {
      throw new UnauthorizedException("You aren't the author of this post.");
    }
    return this.postsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePost(
    @GqlCurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const post = await this.postsService.findOne(id);
    if (post.author.id !== user.id) {
      throw new UnauthorizedException("You aren't the author of this post.");
    }
    return this.postsService.remove(id);
  }

  @ResolveField(() => UserObject)
  async author(@Parent() post: Post) {
    if (post.author) {
      return this.usersService.findOne({ id: post.author.toString() });
    }
    return await this.usersService.findOne({ postId: post.id });
  }
}
