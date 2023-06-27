import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName?: string;
}
