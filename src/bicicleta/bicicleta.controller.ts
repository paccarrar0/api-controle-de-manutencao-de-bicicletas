import {Get, Post, Body, Put, Delete, Query, Param, Controller, UseGuards} from '@nestjs/common';
import { BicicletaService } from './bicicleta.service';
import { CreateBicicletaDto, CreateManutencaoDto } from './dto';
import { BicicletasRO, BicicletaRO } from './bicicleta.interface';
import { ManutencoesRO } from './bicicleta.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags, ApiBody, ApiParam, // <--- Importe o ApiParam
} from '@nestjs/swagger';
import { AuthGuard } from '../user/auth.guard';

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

  @Get(':slug')
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async findOne(@Param('slug') slug): Promise<BicicletaRO> {
    return await this.bicicletaService.findOne({slug});
  }

  @Get(':slug/manutencoes')
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async findManutencoes(@Param('slug') slug): Promise<ManutencoesRO> {
    return await this.bicicletaService.findManutencoes(slug);
  }

  @ApiOperation({ summary: 'Create bicicleta' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateBicicletaDto })
  async create(@User('id') userId: number, @Body('bicicleta') bicicletaData: CreateBicicletaDto) {
    return this.bicicletaService.create(userId, bicicletaData);
  }

  @ApiOperation({ summary: 'Update bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateBicicletaDto })
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async update(@Param() params, @Body('bicicleta') bicicletaData: CreateBicicletaDto) {
    return this.bicicletaService.update(params.slug, bicicletaData);
  }

  @ApiOperation({ summary: 'Delete bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async delete(@Param() params) {
    return this.bicicletaService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create manutencao' })
  @ApiResponse({ status: 201, description: 'The manutencao has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/manutencoes')
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateManutencaoDto })
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta para adicionar manutenção', type: 'string' }) // <--- Adicionado
  async createManutencao(@Param('slug') slug, @Body('manutencao') manutencaoData: CreateManutencaoDto) {
    return await this.bicicletaService.addManutencao(slug, manutencaoData);
  }

  @ApiOperation({ summary: 'Delete manutencao' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/manutencoes/:id')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'slug', type: 'string' }) // <--- Adicionado
  @ApiParam({ name: 'id', type: 'number' })   // <--- Adicionado
  async deleteManutencao(@Param() params) {
    const {slug, id} = params;
    return await this.bicicletaService.deleteManutencao(slug, id);
  }

  @ApiOperation({ summary: 'Favorite bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.bicicletaService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite bicicleta' })
  @ApiResponse({ status: 201, description: 'The bicicleta has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'slug', description: 'Slug da bicicleta', type: 'string' }) // <--- Adicionado
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.bicicletaService.unFavorite(userId, slug);
  }

}