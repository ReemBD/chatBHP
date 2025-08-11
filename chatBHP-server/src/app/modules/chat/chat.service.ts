import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
  private readonly apiKey = this.configService.get('OPENAI_API_KEY');

  constructor(private readonly configService: ConfigService) {}

  async getChatResponse(message: string) {
    // TODO: Implement chat service
    return 'Hello, world!';
  }
}