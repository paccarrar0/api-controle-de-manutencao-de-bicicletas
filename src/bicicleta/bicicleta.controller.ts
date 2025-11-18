import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { BicicletaService } from './bicicleta.service';
import { CreateBicicletaDto, CreateManutencaoDto } from './dto';
import { BicicletasRO, BicicletaRO } from './bicicleta.interface';
import { ManutencoesRO } from './bicicleta.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('bicicletas')
@Controller('bicicletas')
export class BicicletaController {

  constructor(private readonly bicicletaService: BicicletaService) {}

  @ApiOperation({ summary: 'Get all bicicletas' })
  @ApiResponse({ status: 200, description: 'Return all bicicletas.'})
  @Get()
  async findAll(@Query() query): Promise<BicicletasRO> {
    return await this.bicicletaService.findAll(query);
  }


  @ApiOperation({ summary: 'Get bicicleta feed' })
  @ApiResponse({ status: 200, description: 'Return bicicleta feed.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  /*
  async getFeed(@User('id') userId: number, @Query() query): Promise<BicicletasRO> {
    return await this.bicicletaService.findFeed(userId, query);
  }
  */
  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<BicicletaRO> {
    return await this.bicicletaService.findOne({slug});
  }

  @Get(':slug/manutencoes')
  async findManutencoes(@Param('slug') slug): Promise<ManutencoesRO> {
    return await this.bicicletaService.findManutencoes(slug);
  }

  @ApiOperation({ summary: 'Create bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('bicicleta') bicicletaData: CreateBicicletaDto) {
    return this.bicicletaService.create(userId, bicicletaData);
  }

  @ApiOperation({ summary: 'Update bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('bicicleta') bicicletaData: CreateBicicletaDto) {
    // Todo: update slug also when title gets changed
    return this.bicicletaService.update(params.slug, bicicletaData);
  }

  @ApiOperation({ summary: 'Delete bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.bicicletaService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create manutencao' })
  @ApiResponse({ status: 201, description: 'The manutencao has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/manutencoes')
  async createManutencao(@Param('slug') slug, @Body('manutencao') manutencaoData: CreateManutencaoDto) {
    return await this.bicicletaService.addManutencao(slug, manutencaoData);
  }

  @ApiOperation({ summary: 'Delete manutencao' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/manutencoes/:id')
  async deleteManutencao(@Param() params) {
    const {slug, id} = params;
    return await this.bicicletaService.deleteManutencao(slug, id);
  }

  @ApiOperation({ summary: 'Favorite bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.bicicletaService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.bicicletaService.unFavorite(userId, slug);
  }

}