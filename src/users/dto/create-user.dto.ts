import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
