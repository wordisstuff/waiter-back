import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return this.prisma.order.create({
      data: {
        sessionId: dto.sessionId,
        total,
        items: {
          create: dto.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async getOrdersBySession(sessionId: string) {
    return this.prisma.order.findMany({
      where: { sessionId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
