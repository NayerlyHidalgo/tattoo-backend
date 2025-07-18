import { IsEnum, IsOptional } from 'class-validator';
import { EstadoOrden } from '../orden.entity';

export class ChangeEstadoOrdenDto {
  @IsEnum(EstadoOrden)
  estado: EstadoOrden;

  @IsOptional()
  notas?: string;
}
