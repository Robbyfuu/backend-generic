import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsEmail()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  readonly firstName?: string;

  @ApiProperty()
  @IsString()
  readonly lastName?: string;
}
