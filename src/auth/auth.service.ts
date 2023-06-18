import {
  Injectable,
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
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (user) {
      if (!user.isActive) {
        throw new UnauthorizedException(`User is inactive, talk with an admin`);
      }
      const { password, ...result } = user;
      const match = await bcrypt.compare(pass, password);
      if (match) {
        return result;
      }
    }
    return null;
  }

  async generateAccessToken(user: Pick<User, '_id'>) {
    const payload = { sub: String(user._id) };
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
    const token = await this.createRefreshToken(user, expiresIn);
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
        id: payload.jwtId,
      });

      if (!token) {
        throw new UnprocessableEntityException('Refresh token not found');
      }

      if (token.revoked) {
        throw new UnprocessableEntityException('Refresh token revoked');
      }

      const user = await this.usersService.findOne({ id: payload.subject });

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

  async createAccessTokenFromRefreshToken(refresh: string) {
    const { user } = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { user, token };
  }

  async register(email: string, pass: string) {
    const user = await this.usersService.findOne({ email });
    if (user) {
      // error user already exists
      throw new UnprocessableEntityException('User already exists');
    }

    const userResponse = await this.usersService.create({
      email,
      password: pass,
    });
    return userResponse;
  }
  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      // error user already exists
      throw new UnprocessableEntityException('User does not exist');
    }
    const { password, ...result } = user;
    const match = await bcrypt.compare(pass, password);
    if (!match) {
      throw new UnprocessableEntityException('Invalid credentials');
    }
    return result;
  }
}
