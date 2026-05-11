import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { SenderType } from '@prisma/client';
import { N8nService } from '../n8n/n8n.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly n8nService: N8nService,
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

    const n8nResponse = await this.n8nService.sendMessage({
      sessionId: session.id,
      restaurantId: session.restaurantId,
      tableId: session.tableId,
      tableNumber: session.table.number,
      partySize: session.partySize,
      message: dto.message,
    });

    const answer =
      n8nResponse.answer ||
      n8nResponse.content ||
      'Sorry, I could not process your request.';

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
    };
  }

  async getMessages(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
