//Package
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//Entity
import { Post } from './entities/post.entity';
//DTOs
import { CreatePostInput, UpdatePostInput, FetchPostArgs } from './dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async create(
    authorId: string,
    createPostInput: CreatePostInput,
  ): Promise<Post> {
    const post = new this.postModel({
      author: authorId,
      ...createPostInput,
    });

    await post.save();
    return post;
  }

  async findAll(args?: FetchPostArgs) {
    const { offset, limit } = args;

    return await this.postModel.find().skip(offset).limit(limit);
  }
  async findAllByAuthorId(authorId: string) {
    return await this.postModel.find({ author: authorId });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostInput): Promise<Post> {
    const post = await this.postModel.findById(id);
    post.set(updatePostDto);
    return post.save();
  }

  async remove(id: string): Promise<boolean> {
    await this.postModel.findByIdAndRemove(id);
    return true;
  }
}
