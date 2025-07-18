import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  productoId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsNotEmpty()
  @IsString()
  comentario: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes?: string[];

  @IsOptional()
  @IsBoolean()
  compraVerificada?: boolean;
}
