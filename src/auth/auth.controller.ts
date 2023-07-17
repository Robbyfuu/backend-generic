import {
  Body,
  Controller,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginUserBody } from './dto/login-user.body';
import { LoginUserResponse } from './dto/login-user.response';
import { RefreshTokenResponse } from './dto/refresh-token.response';

import { RegisterUserResponse } from './dto/register-user.response';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserBody } from './dto';

@Controller('auth')
export class AuthController {
  logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('loginRefresh')
  @ApiBody({ type: LoginUserBody })
  @ApiOkResponse({
    description: 'User has been logged in.',
    type: LoginUserResponse,
  })
  async loginRefresh(@Request() req): Promise<LoginUserResponse> {
    const accessToken = await this.authService.generateAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(
      req.user,
      12 * 60 * 60 * 1000,
    );
    // const user = await this.authService.getUserFromToken(req.user);
    delete req.user._doc.password;
    const payload = new LoginUserResponse();
    payload.user = req.user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
    // return this.authService.loginRefresh(req.user);
  }
  //@UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserBody })
  @ApiOkResponse({
    description: 'User has been logged in.',
    type: LoginUserResponse,
  })
  async login(@Body() loginInput: LoginUserBody): Promise<LoginUserResponse> {
    const user = await this.authService.login(loginInput);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      12 * 60 * 60 * 1000,
    );

    const payload = new LoginUserResponse();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }

  @Post('refresh')
  @ApiOkResponse({
    description: 'Generates a new access token.',
    type: RefreshTokenResponse,
  })
  async refresh(@Body() body) {
    this.logger.log(body);
    const { user, token } =
      await this.authService.createAccessTokenFromRefreshToken(
        body.refreshToken,
      );
    const userDto = user as UserDto;

    const payload = new RefreshTokenResponse();
    payload.user = userDto;
    payload.accessToken = token;

    return payload;
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'User has been registered.',
    type: RegisterUserResponse,
  })
  async register(@Body() registerInput: RegisterUserBody) {
    const user = await this.authService.register(
      registerInput.email,
      registerInput.password,
      registerInput.roles,
      registerInput.firstName,
      registerInput.lastName,
    );
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      12 * 60 * 60 * 1000,
    );
    const payload = new RegisterUserResponse();
    payload.user = user;
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }
}
