import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';
import { UpdatePostInput } from './dto/update-post.input';
import { ObjectId } from 'mongoose';

interface FindAllArgs {
  relations?: string[];
  authorId?: number;
}

interface FindOneArgs extends FindAllArgs {
  id: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async create(authorId: string, createPostInput: CreatePostInput) {
    console.log(authorId);
    const postInput = {
      author: authorId,
      ...createPostInput,
    };
    const post = new this.postModel(postInput);
    await post.save();
    return post;
  }

  findAll(args?: FindAllArgs) {
    const { relations, authorId } = args;
    let where = {};
    if (authorId) {
      where = { ...where, author: { id: authorId } };
    }
    return this.postModel.find(where, relations);
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id);
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
