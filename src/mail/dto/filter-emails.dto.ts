import { IsOptional, IsString, IsEmail, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  OPENED = 'opened'
}

export enum EmailProvider {
  GMAIL = 'gmail',
  SENDGRID = 'sendgrid',
  SMTP = 'smtp'
}

export class FilterEmailsDto {
  @IsOptional()
  @IsEmail()
  to?: string;

  @IsOptional()
  @IsEmail()
  from?: string;

  @IsOptional()
  @IsEnum(EmailStatus)
  status?: EmailStatus;

  @IsOptional()
  @IsEnum(EmailProvider)
  provider?: EmailProvider;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'sentAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
