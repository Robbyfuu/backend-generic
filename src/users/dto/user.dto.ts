import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '../entities/user.entity';

@Exclude()
export class UserDto {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true }) // Transformar ObjectId a cadena
  readonly _id?: string;

  @Expose()
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @Expose()
  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @Expose()
  @ApiProperty()
  @IsBoolean()
  readonly isActive: boolean;

  @Expose()
  @ApiProperty()
  @IsString()
  readonly lastName: string;
}
