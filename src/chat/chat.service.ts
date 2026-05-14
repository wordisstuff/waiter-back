import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { SenderType, SessionStatus, TableStatus } from '@prisma/client';
import { MenuService } from 'src/menu/menu.service';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly menuService: MenuService,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: dto.sessionId },
      include: {
        table: true,
        restaurant: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: SenderType.CUSTOMER,
        content: dto.message,
      },
    });

    const menu = this.menuService.getMenu();

    const recentMessages = await this.prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    const history: { role: 'user' | 'assistant'; content: string }[] =
      recentMessages.reverse().map((message) => ({
        role: message.sender === SenderType.CUSTOMER ? 'user' : 'assistant',
        content: message.content,
      }));

      const currentOrder = await this.prisma.order.findFirst({
        where: {
          sessionId: session.id,
          status: {
            in: ['CONFIRMED', 'COOKING', 'READY'],
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    const aiResponse = await this.aiService.askWaiter({
      message: dto.message,
      tableNumber: session.table.number,
      partySize: session.partySize,
      history,
      menu,
      currentOrder,
    });

    const answer =
      aiResponse.answer || 'Sorry, I could not process your request.';

    const aiMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        sender: SenderType.AI,
        content: answer,
      },
    });

    return {
      sessionId: session.id,
      answer: aiMessage.content,
      recommendedItemIds: aiResponse.recommendedItemIds ?? [],
    };
  }

  async getMessages(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
  async closeSession(sessionId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        table: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const closedSession = await tx.chatSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.CLOSED,
          closedAt: new Date(),
        },
      });

      const updatedTable = await tx.restaurantTable.update({
        where: { id: session.tableId },
        data: {
          status: TableStatus.CLEANING,
        },
      });

      return {
        session: closedSession,
        table: updatedTable,
      };
    });

    return {
      message: 'Session closed. Table is now waiting for cleaning.',
      session: result.session,
      table: result.table,
    };
  }
}
