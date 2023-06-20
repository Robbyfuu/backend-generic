import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from 'src/users/entities/user.entity';
import { LoginUserBody, RegisterUserBody } from './dto';
import { UserDto } from 'src/users/dto';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async validateUserWithPassword(
    email: string,
    pass: string,
  ): Promise<UserDto> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      if (!user.isActive) {
        throw new UnauthorizedException(`User is inactive, talk with an admin`);
      }
      const { password } = user;
      const match = await bcrypt.compare(pass, password);
      delete user.password;
      if (match) {
        return user;
      }
    }
    return null;
  }
  async validateUser(id: string): Promise<UserDto> {
    const user = await this.usersService.findOne({ id });

    if (!user.isActive) {
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }
    return user;
  }

  async generateAccessToken(user: Pick<User, 'id'>) {
    const payload = { sub: String(user.id) };
    return await this.jwtService.signAsync(payload);
  }

  async createRefreshToken(user: Pick<User, 'id'>, ttl: number) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttl);

    const token = this.refreshTokenModel.create({
      user,
      expires: expiration,
    });

    await (await token).save();

    return token;
  }

  async generateRefreshToken(user: Pick<User, 'id'>, expiresIn: number) {
    const payload = { sub: String(user.id) };
    const token = await this.createRefreshToken(user.id, expiresIn);
    return await this.jwtService.signAsync({
      ...payload,
      expiresIn,
      jwtId: String(token.id),
    });
  }

  async resolveRefreshToken(encoded: string) {
    try {
      const payload = await this.jwtService.verify(encoded);
      if (!payload.sub || !payload.jwtId) {
        throw new UnprocessableEntityException('Refresh token malformed');
      }

      const token = await this.refreshTokenModel.findOne({
        _id: payload.jwtId,
      });
      this.logger.log(token);

      if (!token) {
        throw new UnprocessableEntityException('Refresh token not found');
      }

      if (token.revoked) {
        throw new UnprocessableEntityException('Refresh token revoked');
      }

      const user = await this.usersService.findOne({ id: payload.sub });
      if (!user) {
        throw new UnprocessableEntityException('Refresh token malformed');
      }

      return { user, token };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }
  async getUserFromToken(token: string): Promise<UserDto> {
    const payload = await this.jwtService.verify(token);
    const user = await this.usersService.findOne({ id: payload.sub });
    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return user;
  }

  async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  async register(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      // error user already exists
      throw new UnprocessableEntityException('User already exists');
    }
    const registerUserBody: RegisterUserBody = {
      email,
      password: pass,
    };
    const userResponse = await this.usersService.create(registerUserBody);
    return userResponse;
  }
  async login(loginInput: LoginUserBody): Promise<UserDto> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOne({ email });
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    return user;
  }
  async loginRefresh(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
