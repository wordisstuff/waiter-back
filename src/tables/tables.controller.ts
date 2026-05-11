import { Body, Controller, Param, Post } from '@nestjs/common';
import { TablesService } from './tables.service';
import { ReserveTableDto } from './dto/reserve-table.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post(':id/reserve')
  reserveTable(@Param('id') id: string, @Body() dto: ReserveTableDto) {
    return this.tablesService.reserveTable(id, dto);
  }
}
