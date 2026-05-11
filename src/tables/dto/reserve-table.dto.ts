// src/tables/dto/reserve-table.dto.ts

import { IsInt, Min } from 'class-validator';

export class ReserveTableDto {
  @IsInt()
  @Min(1)
  partySize: number;
}
