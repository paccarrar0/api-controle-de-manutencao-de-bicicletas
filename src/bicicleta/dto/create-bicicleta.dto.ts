import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBicicletaDto {

  @ApiProperty({ example: 'Caloi', description: 'Marca da bicicleta' })
  @IsNotEmpty()
  readonly marca: string;

  @ApiProperty({ example: 'Elite Carbon', description: 'Modelo da bicicleta' })
  @IsNotEmpty()
  readonly modelo: string;

  @ApiProperty({ example: 'Preta', description: 'Cor da bicicleta' })
  @IsNotEmpty()
  readonly cor: string;

  @ApiProperty({ example: 29, description: 'Tamanho do aro' })
  @IsNotEmpty()
  readonly aro: number;

  @ApiProperty({ example: 'Nova', description: 'Estado atual da bicicleta', required: false })
  readonly status: string;
}