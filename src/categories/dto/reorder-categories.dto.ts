import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CategoryOrderItem {
  id: string;
  orden: number;
}

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderItem)
  categories: CategoryOrderItem[];
}
