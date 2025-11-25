import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { BicicletaEntity } from '../bicicleta/bicicleta.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany(type => BicicletaEntity)
  @JoinTable()
  favorites: BicicletaEntity[];

  @OneToMany(type => BicicletaEntity, bicicleta => bicicleta.author)
  bicicletas: BicicletaEntity[];
}
