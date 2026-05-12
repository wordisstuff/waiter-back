import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
