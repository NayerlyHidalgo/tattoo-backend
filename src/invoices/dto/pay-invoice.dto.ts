import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';

export class PayInvoiceDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentReference?: string;

  @IsOptional()
  @IsDateString()
  paidDate?: string;
}
