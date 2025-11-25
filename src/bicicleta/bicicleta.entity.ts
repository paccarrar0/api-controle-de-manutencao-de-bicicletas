import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Manutencao } from './manutencao.entity';

@Entity('bicicleta')
export class BicicletaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  modelo: string;

  @Column()
  marca: string;

  @Column()
  cor: string;

  @Column()
  aro: number;

  @Column({default: 'nova'})
  status: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @ManyToOne(type => UserEntity, user => user.bicicletas)
  author: UserEntity;

  @OneToMany(type => Manutencao, manutencao => manutencao.bicicleta, {eager: true})
  @JoinColumn()
  manutencoes: Manutencao[];

  @Column({default: 0})
  favoriteCount: number;
}