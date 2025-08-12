import { Controller, Post, Body, Get, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  async getChatHistory() {
    try {
      return this.chatService.getChatHistory();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get chat history', error.message);
    }
  }
}