import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenValidator {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  validateToken(token: any) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (e) {
      throw e;
    }
  }
}
