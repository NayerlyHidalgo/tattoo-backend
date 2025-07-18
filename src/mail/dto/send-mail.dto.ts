import { IsString, IsEmail, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsOptional()
  @IsBoolean()
  isHighPriority?: boolean;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  templateData?: Record<string, any>;
}
