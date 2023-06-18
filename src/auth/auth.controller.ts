import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { LoginUserBody } from './dto/login-user.body';
import { LoginUserResponse } from './dto/login-user.response';
import { RefreshTokenBody } from './dto/refresh-token.body';
import { RefreshTokenResponse } from './dto/refresh-token.response';

import { RegisterUserResponse } from './dto/register-user.response';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterUserInput, RegisterUserBody } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('loginRefresh')
  @ApiBody({ type: LoginUserBody })
  @ApiOkResponse({
    description: 'User has been logged in.',
    type: LoginUserResponse,
  })
  async loginRefresh(@Request() req) {
    console.log(req);
    const accessToken = await this.authService.generateAccessToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(
      req.user,
      60 * 60 * 24 * 30,
    );

    const payload = new LoginUserResponse();
    payload.user = new UserDto(req.user);
    payload.accessToken = accessToken;
    payload.refreshToken = refreshToken;

    return payload;
  }
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserBody })
  @ApiOkResponse({
    description: 'User has been logged in.',
    type: LoginUserResponse,
  })
  async login(@Body() loginInput: LoginUserBody) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );
    const { _id, email, isActive, firstName, lastName } = user;
    const payload = {
      user: user,
      accessToken,
      refreshToken,
    };

    return payload;
  }

  @Post('refresh')
  @ApiOkResponse({
    description: 'Generates a new access token.',
    type: RefreshTokenResponse,
  })
  async refresh(@Body() refreshInput: RefreshTokenBody) {
    console.log(refreshInput);
    const { user, token } =
      await this.authService.createAccessTokenFromRefreshToken(
        refreshInput.refreshToken,
      );

    const payload = new RefreshTokenResponse();
    payload.user = new UserDto(user);
    payload.accessToken = token;

    return payload;
  }

  @Post('register')
  @ApiCreatedResponse({
    description: 'User has been registered.',
    type: RegisterUserResponse,
  })
  async register(@Body() registerInput: RegisterUserBody) {
    console.log(registerInput);
    const user = await this.authService.register(
      registerInput.email,
      registerInput.password,
    );
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      60 * 60 * 24 * 30,
    );
    const { _id, email, isActive, firstName, lastName } = user;
    const payload = {
      user: { _id, email, isActive, firstName, lastName },
      accessToken,
      refreshToken,
    };
    // payload.user = { _id, email, isActive, firstName, lastName };
    // payload.accessToken = accessToken;
    // payload.refreshToken = refreshToken;

    return payload;
  }
}
