import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { N8nModule } from '../n8n/n8n.module';

@Module({
  imports: [PrismaModule, N8nModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
