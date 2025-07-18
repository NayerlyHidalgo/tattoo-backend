import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  productoId: string;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class RemoveFromCartDto {
  @IsUUID()
  cartItemId: string;
}
