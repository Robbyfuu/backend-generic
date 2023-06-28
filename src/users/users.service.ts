import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateProfileDto, UpdateProfileInput } from './dto';
import { RegisterUserBody } from 'src/auth/dto';
import { UserDto } from './dto/user.dto';

interface FindAllArgs {
  relations?: string[];
}
interface FindOneArgs extends FindAllArgs {
  id?: string;
  email?: string;
  postId?: number;
}
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}
  private logger: Logger = new Logger('UsersService');
  async create(createUserInput: RegisterUserBody): Promise<User> {
    try {
      const user = this.usersModel.create({
        ...createUserInput,
        password: bcrypt.hashSync(createUserInput.password, 10),
      });
      await (await user).save();
      return user;
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersModel.find({}).exec();
    return users;
  }

  async findOne({ id, email, postId, relations }: FindOneArgs): Promise<User> {
    if (id) {
      return await this.usersModel.findById(id);
    } else if (email) {
      return await this.usersModel.findOne({
        email: { $regex: new RegExp('^' + email + '$', 'i') },
      });
    } else if (postId) {
      return await this.usersModel
        .findOne({ posts: new Types.ObjectId(postId) })
        .populate(relations);
    } else {
      throw new Error('One of ID, email or post ID must be provided.');
    }
  }
  async findByEmail(email: string): Promise<UserDto> {
    return await this.usersModel.findOne({
      email: { $regex: new RegExp('^' + email + '$', 'i') },
    });
  }

  async update(
    id: string,
    updateUserInput: UpdateProfileInput | UpdateProfileDto,
  ): Promise<UserDto> {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserInput);
    await user.save();

    return user;
  }
  async remove(id: string) {
    const user = await this.usersModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = false;
    await user.save();
    return true;
  }
  private handleDBError(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(error.message.split(':')[2]);
    }
    this.logger.error(error.message);
    throw new InternalServerErrorException('Please check server logs');
  }
}
