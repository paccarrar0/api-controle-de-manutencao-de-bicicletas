import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManutencaoDto {

  @ApiProperty({ example: 'Troca de pastilhas de freio', description: 'Descrição do serviço' })
  @IsNotEmpty()
  readonly descricao: string;

  @ApiProperty({ example: 150.00, description: 'Custo do serviço', required: false })
  readonly custo: number;
}