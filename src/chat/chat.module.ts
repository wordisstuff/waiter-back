import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { N8nModule } from '../n8n/n8n.module';
import { MenuModule } from 'src/menu/menu.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [PrismaModule, N8nModule, MenuModule, AiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
