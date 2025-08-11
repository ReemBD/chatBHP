import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Injectable()
export class ChatService {
  constructor(private readonly openaiService: OpenAIService) {}

  async getChatResponse(message: string) {
    try {
      const completion = await this.openaiService.createChatCompletion([
        {
          role: 'user',
          content: message,
        },
      ]);

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Failed to get chat response');
    }
  }
}