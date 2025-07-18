import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, IsDateString, IsUUID } from 'class-validator';
import { EstadoOrden } from '../orden.entity';
import { MetodoPago } from '../orden.entity';
import { Type } from 'class-transformer';

class OrdenItemDto {
  @IsUUID()
  productoId: string;

  @IsString()
  nombreProducto: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsNumber()
  subtotal: number;
}

export class CreateOrdenDto {
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @IsOptional()
  @IsUUID()
  usuarioId?: string;

  @IsOptional()
  guestCustomerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  @IsOptional()
  paymentInfo?: {
    method: string;
    cardType: string;
    lastFour: string;
    status: string;
  };

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdenItemDto)
  items: OrdenItemDto[];

  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  impuestos?: number;

  @IsOptional()
  @IsNumber()
  costoEnvio?: number;

  @IsOptional()
  @IsNumber()
  descuento?: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsEnum(EstadoOrden)
  estado?: EstadoOrden;

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsString()
  direccionEnvio?: string;

  @IsOptional()
  @IsString()
  ciudadEnvio?: string;

  @IsOptional()
  @IsString()
  codigoPostalEnvio?: string;

  @IsOptional()
  @IsString()
  paisEnvio?: string;

  @IsOptional()
  @IsString()
  numeroSeguimiento?: string;

  @IsOptional()
  @IsString()
  empresaEnvio?: string;

  @IsOptional()
  @IsDateString()
  fechaEnvio?: Date;

  @IsOptional()
  @IsDateString()
  fechaEntregaEstimada?: Date;

  @IsOptional()
  @IsString()
  notas?: string;
}
