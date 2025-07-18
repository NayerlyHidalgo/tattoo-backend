import { IsOptional, IsString, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class FilterReviewsDto {
  @IsOptional()
  @IsString()
  productoId?: string;

  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsBoolean()
  aprobada?: boolean;

  @IsOptional()
  @IsBoolean()
  compraVerificada?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
