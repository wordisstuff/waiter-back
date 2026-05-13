import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { TablesService } from './tables.service';
import { ReserveTableDto } from './dto/reserve-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post(':id/reserve')
  reserveTable(@Param('id') id: string, @Body() dto: ReserveTableDto) {
    return this.tablesService.reserveTable(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTableStatusDto) {
    return this.tablesService.updateStatus(id, dto.status);
  }

  @Patch(':id/cleaned')
  markCleaned(@Param('id') id: string) {
    return this.tablesService.markCleaned(id);
  }
}
