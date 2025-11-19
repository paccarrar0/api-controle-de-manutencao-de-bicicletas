import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BicicletaController } from './bicicleta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BicicletaEntity } from './bicicleta.entity';
import { Manutencao } from './manutencao.entity';
import { UserEntity } from '../user/user.entity';
import { BicicletaService } from './bicicleta.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BicicletaEntity, Manutencao, UserEntity]), UserModule],
  providers: [BicicletaService],
  controllers: [
    BicicletaController
  ]
})
export class BicicletaModule {
}
