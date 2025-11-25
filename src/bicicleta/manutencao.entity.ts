import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BicicletaEntity } from './bicicleta.entity';

@Entity()
export class Manutencao {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column()
  custo: number;

  @ManyToOne(type => BicicletaEntity, bicicleta => bicicleta.manutencoes)
  bicicleta: BicicletaEntity;
}