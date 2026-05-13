import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(dto);
  }

  @Get('sessions/:sessionId/messages')
  getMessages(@Param('sessionId') sessionId: string) {
    return this.chatService.getMessages(sessionId);
  }

  @Patch('sessions/:sessionId/close')
  closeSession(@Param('sessionId') sessionId: string) {
    return this.chatService.closeSession(sessionId);
  }
}
