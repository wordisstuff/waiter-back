import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  sessionId: string;

  @IsString()
  message: string;
}
