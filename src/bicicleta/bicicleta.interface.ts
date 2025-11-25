import { UserData } from '../user/user.interface';
import { BicicletaEntity } from './bicicleta.entity';
interface Manutencao {
  body: string;
}

interface BicicletaData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date
  updatedAt?: Date
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserData;
}

export interface ManutencoesRO {
  manutencoes: Manutencao[];
}

export interface BicicletaRO {
  bicicleta: BicicletaEntity;
}

export interface BicicletasRO {
  bicicletas: BicicletaEntity[];
  bicicletasCount: number;
}

