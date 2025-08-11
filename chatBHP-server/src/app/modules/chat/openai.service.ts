import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService implements OnModuleInit {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  getClient(): OpenAI {
    return this.openai;
  }

  async createChatCompletion(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[], options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: options?.model || 'gpt-3.5-turbo',
        messages,
        max_tokens: options?.maxTokens || 150,
        temperature: options?.temperature || 0.7,
      });

      return completion;  
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to create chat completion');
    }
  }
}
