import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {

  @ApiProperty({ example: 'pedro@email.com', description: 'Email registado' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha do utilizador' })
  @IsNotEmpty()
  readonly password: string;
}