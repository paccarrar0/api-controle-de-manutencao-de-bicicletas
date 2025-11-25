import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {

  @ApiProperty({ example: 'pedro', description: 'Nome do usuário' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'pedro@email.com', description: 'Email do usuário' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  @IsNotEmpty()
  readonly password: string;
}