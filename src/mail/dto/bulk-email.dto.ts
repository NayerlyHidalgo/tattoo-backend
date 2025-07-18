import { IsArray, IsString } from 'class-validator';

export class BulkEmailDto {
  @IsArray()
  @IsString({ each: true })
  emailIds: string[];
}

export class ResendEmailDto {
  @IsString()
  emailId: string;
}
