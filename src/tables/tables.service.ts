import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReserveTableDto } from './dto/reserve-table.dto';
import { TableStatus } from '@prisma/client';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveTable(tableId: string, dto: ReserveTableDto) {
    const table = await this.prisma.restaurantTable.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (table.status !== TableStatus.FREE) {
      throw new BadRequestException('Table is not available');
    }

    if (dto.partySize > table.seats) {
      throw new BadRequestException('Party size is bigger than table seats');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const session = await tx.chatSession.create({
        data: {
          restaurantId: table.restaurantId,
          tableId: table.id,
          partySize: dto.partySize,
        },
      });

      const updatedTable = await tx.restaurantTable.update({
        where: { id: table.id },
        data: {
          status: TableStatus.RESERVED,
          currentSessionId: session.id,
        },
      });

      return {
        session,
        table: updatedTable,
      };
    });

    return {
      sessionId: result.session.id,
      table: result.table,
      assistantMessage: `Your table ${result.table.number} is reserved for ${dto.partySize} guest(s). Please go to your table. You can start asking about the menu here.`,
    };
  }

  async updateStatus(tableId: string, status: TableStatus) {
    const table = await this.prisma.restaurantTable.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const updatedTable = await this.prisma.restaurantTable.update({
      where: { id: tableId },
      data: {
        status,
      },
    });

    return {
      message: `Table status updated to ${status}`,
      table: updatedTable,
    };
  }

  async markCleaned(tableId: string) {
    const table = await this.prisma.restaurantTable.findUnique({
      where: { id: tableId },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const updatedTable = await this.prisma.restaurantTable.update({
      where: { id: tableId },
      data: {
        status: TableStatus.FREE,
        currentSessionId: null,
      },
    });

    return {
      message: 'Table is now free',
      table: updatedTable,
    };
  }
}
