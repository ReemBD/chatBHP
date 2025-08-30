import { Controller, Get, InternalServerErrorException } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatMappingsService } from './chat-mappings.service';

@Controller('api/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatMappingsService: ChatMappingsService,
  ) {}

  @Get('history')
  async getChatHistory() {
    try {
      return this.chatService.getChatHistory();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get chat history', error.message);
    }
  }

  @Get('mappings')
  async getChatMappings() {
    try {
      return this.chatMappingsService.getChatMappings();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get chat mappings', error.message);
    }
  }
}