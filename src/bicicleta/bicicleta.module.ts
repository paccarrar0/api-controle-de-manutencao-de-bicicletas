import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BicicletaController } from './bicicleta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BicicletaEntity } from './bicicleta.entity';
import { Manutencao } from './manutencao.entity';
import { UserEntity } from '../user/user.entity';
import { BicicletaService } from './bicicleta.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BicicletaEntity, Manutencao, UserEntity]), UserModule],
  providers: [BicicletaService],
  controllers: [
    BicicletaController
  ]
})
export class BicicletaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'bicicletas/feed', method: RequestMethod.GET},
        {path: 'bicicletas', method: RequestMethod.POST},
        {path: 'bicicletas/:slug', method: RequestMethod.DELETE},
        {path: 'bicicletas/:slug', method: RequestMethod.PUT},
        {path: 'bicicletas/:slug/manutencoes', method: RequestMethod.POST},
        {path: 'bicicletas/:slug/manutencoes/:id', method: RequestMethod.DELETE},
        {path: 'bicicletas/:slug/favorite', method: RequestMethod.POST},
        {path: 'bicicletas/:slug/favorite', method: RequestMethod.DELETE});
  }
}
