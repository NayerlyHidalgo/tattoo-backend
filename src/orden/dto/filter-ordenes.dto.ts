import { IsOptional, IsUUID } from 'class-validator';

export class FilterOrdenesDto {
  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  estado?: string;

  @IsOptional()
  fechaDesde?: string;

  @IsOptional()
  fechaHasta?: string;
}
