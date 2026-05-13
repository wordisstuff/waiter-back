import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    const session = await this.prisma.chatSession.findUnique({
      where: { id: dto.sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const total = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const estimatedMinutes = 25;
    const estimatedReadyAt = new Date(
      Date.now() + estimatedMinutes * 60 * 1000,
    );

    return this.prisma.order.create({
      data: {
        sessionId: dto.sessionId,
        total,
        status: OrderStatus.CONFIRMED,
        estimatedMinutes,
        estimatedReadyAt,
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

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
      },
    });
  }
}
