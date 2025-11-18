import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { BicicletaEntity } from './bicicleta.entity';
import { Manutencao } from './manutencao.entity';
import { UserEntity } from '../user/user.entity';
import { CreateBicicletaDto } from './dto';

import {BicicletaRO, BicicletasRO, ManutencoesRO} from './bicicleta.interface';
const slug = require('slug');

@Injectable()
export class BicicletaService {
  constructor(
    @InjectRepository(BicicletaEntity)
    private readonly bicicletaRepository: Repository<BicicletaEntity>,
    @InjectRepository(Manutencao)
    private readonly manutencaoRepository: Repository<Manutencao>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(query): Promise<BicicletasRO> {

    const qb = await getRepository(BicicletaEntity)
      .createQueryBuilder('bicicleta')
      .leftJoinAndSelect('bicicleta.author', 'author');

    qb.where("1 = 1");

    if ('tag' in query) {
      qb.andWhere("bicicleta.tagList LIKE :tag", { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("bicicleta.authorId = :id", { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({username: query.favorited});
      const ids = author.favorites.map(el => el.id);
      qb.andWhere("bicicleta.authorId IN (:ids)", { ids });
    }

    qb.orderBy('bicicleta.created', 'DESC');

    const bicicletasCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const bicicletas = await qb.getMany();

    return {bicicletas, bicicletasCount};
  }

  /*async findFeed(userId: number, query): Promise<BicicletasRO> {
    const _follows = await this.followsRepository.find( {followerId: userId});

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return {bicicletas: [], bicicletasCount: 0};
    }

    const ids = _follows.map(el => el.followingId);

    const qb = await getRepository(BicicletaEntity)
      .createQueryBuilder('bicicleta')
      .where('bicicleta.authorId IN (:ids)', { ids });

    qb.orderBy('bicicleta.created', 'DESC');

    const bicicletasCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const bicicletas = await qb.getMany();

    return {bicicletas, bicicletasCount};
  }
*/
  async findOne(where): Promise<BicicletaRO> {
    const bicicleta = await this.bicicletaRepository.findOne(where);
    return {bicicleta};
  }

  async addManutencao(slug: string, manutencaoData): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});

    const manutencao = new Manutencao();
    manutencao.body = manutencaoData.body;

    bicicleta.manutencoes.push(manutencao);

    await this.manutencaoRepository.save(manutencao);
    bicicleta = await this.bicicletaRepository.save(bicicleta);
    return {bicicleta}
  }

  async deleteManutencao(slug: string, id: string): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});

    const manutencao = await this.manutencaoRepository.findOne(id);
    const deleteIndex = bicicleta.manutencoes.findIndex(_manutencao => _manutencao.id === manutencao.id);

    if (deleteIndex >= 0) {
      const deleteManutencoes = bicicleta.manutencoes.splice(deleteIndex, 1);
      await this.manutencaoRepository.delete(deleteManutencoes[0].id);
      bicicleta =  await this.bicicletaRepository.save(bicicleta);
      return {bicicleta};
    } else {
      return {bicicleta};
    }

  }

  async favorite(id: number, slug: string): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const isNewFavorite = user.favorites.findIndex(_bicicleta => _bicicleta.id === bicicleta.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(bicicleta);
      bicicleta.favoriteCount++;

      await this.userRepository.save(user);
      bicicleta = await this.bicicletaRepository.save(bicicleta);
    }

    return {bicicleta};
  }

  async unFavorite(id: number, slug: string): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});
    const user = await this.userRepository.findOne(id);

    const deleteIndex = user.favorites.findIndex(_bicicleta => _bicicleta.id === bicicleta.id);

    if (deleteIndex >= 0) {

      user.favorites.splice(deleteIndex, 1);
      bicicleta.favoriteCount--;

      await this.userRepository.save(user);
      bicicleta = await this.bicicletaRepository.save(bicicleta);
    }

    return {bicicleta};
  }

  async findManutencoes(slug: string): Promise<ManutencoesRO> {
    const bicicleta = await this.bicicletaRepository.findOne({slug});
    return {manutencoes: bicicleta.manutencoes};
  }

  async create(userId: number, bicicletaData: CreateBicicletaDto): Promise<BicicletaEntity> {

    let bicicleta = new BicicletaEntity();
    bicicleta.modelo = bicicletaData.modelo;
    bicicleta.cor = bicicletaData.cor;
    bicicleta.marca = bicicletaData.marca;
    bicicleta.status = bicicletaData.status;
    bicicleta.slug = this.slugify(bicicletaData.modelo);
    bicicleta.manutencoes = [];

    const newBicicleta = await this.bicicletaRepository.save(bicicleta);

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['bicicletas'] });
    author.bicicletas.push(bicicleta);

    await this.userRepository.save(author);

    return newBicicleta;

  }

  async update(slug: string, bicicletaData: any): Promise<BicicletaRO> {
    let toUpdate = await this.bicicletaRepository.findOne({ slug: slug});
    let updated = Object.assign(toUpdate, bicicletaData);
    const bicicleta = await this.bicicletaRepository.save(updated);
    return {bicicleta};
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.bicicletaRepository.delete({ slug: slug});
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}
