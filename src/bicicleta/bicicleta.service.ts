import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { BicicletaEntity } from './bicicleta.entity';
import { Manutencao } from './manutencao.entity';
import { UserEntity } from '../user/user.entity';
import { CreateBicicletaDto } from './dto';

import { BicicletaRO, BicicletasRO, ManutencoesRO } from './bicicleta.interface';
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
      if (author) {
        qb.andWhere("bicicleta.authorId = :id", { id: author.id });
      }
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites']
      });
      
      if (author) {
        const ids = author.favorites.map(el => el.id);
        if (ids.length > 0) {
          qb.andWhere("bicicleta.authorId IN (:ids)", { ids });
        } else {
          // Se o usuário não favoritou nada, retorna lista vazia para essa query
          qb.andWhere("1 = 0");
        }
      }
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

  async findOne(where): Promise<BicicletaRO> {
    // Adicionado relations para trazer o autor ao buscar por slug
    const bicicleta = await this.bicicletaRepository.findOne({ 
      where, 
      relations: ['author'] 
    });
    return {bicicleta};
  }

  async addManutencao(slug: string, manutencaoData): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});

    const manutencao = new Manutencao();
    // CORREÇÃO: Mapeando corretamente os campos do DTO
    manutencao.body = manutencaoData.descricao;
    manutencao.custo = manutencaoData.custo;

    bicicleta.manutencoes.push(manutencao);

    await this.manutencaoRepository.save(manutencao);
    bicicleta = await this.bicicletaRepository.save(bicicleta);
    return {bicicleta}
  }

  async deleteManutencao(slug: string, id: string): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});

    const manutencao = await this.manutencaoRepository.findOne(id);
    
    if (manutencao) {
      const deleteIndex = bicicleta.manutencoes.findIndex(_manutencao => _manutencao.id === manutencao.id);

      if (deleteIndex >= 0) {
        const deleteManutencoes = bicicleta.manutencoes.splice(deleteIndex, 1);
        await this.manutencaoRepository.delete(deleteManutencoes[0].id);
        bicicleta =  await this.bicicletaRepository.save(bicicleta);
      }
    }
    
    return {bicicleta};
  }

  async favorite(id: number, slug: string): Promise<BicicletaRO> {
    let bicicleta = await this.bicicletaRepository.findOne({slug});
    // CORREÇÃO: Carregando a relação 'favorites'
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites']
    });

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
    // CORREÇÃO: Carregando a relação 'favorites'
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites']
    });

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
    bicicleta.aro = bicicletaData.aro; // Correção anterior mantida
    bicicleta.status = bicicletaData.status;
    bicicleta.slug = this.slugify(bicicletaData.modelo);
    bicicleta.manutencoes = [];

    // Otimização: Associar autor diretamente
    const author = await this.userRepository.findOne(userId);
    bicicleta.author = author;

    const newBicicleta = await this.bicicletaRepository.save(bicicleta);

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