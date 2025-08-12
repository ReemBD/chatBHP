import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ChatMessage } from '@chat-bhp/core/api-types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { FrontendAgent } from './agents/frontend.agent';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly chatHistoryFile = path.join(process.cwd(), 'chat-history.json');

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly frontendAgent: FrontendAgent,
  ) {}

  async saveMessage(message: ChatMessage): Promise<void> {
    try {
      const messages = await this.loadChatHistory();
      messages.push(message);
      await this.saveChatHistory(messages);
      this.logger.log(`Message saved: ${message.username} - ${message.message.substring(0, 50)}...`);
    } catch (error) {
      this.logger.error('Failed to save message:', error);
      throw error;
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      return await this.loadChatHistory();
    } catch (error) {
      this.logger.error('Failed to load chat history:', error);
      return [];
    }
  }

  async getChatResponse(message: string): Promise<string> {
    try {
      const completion = await this.openaiService.createChatCompletion([
        {
          role: 'user',
          content: message,
        },
      ]);

      const response = completion.choices[0]?.message?.content || 'No response generated';
      this.logger.log('AI response generated successfully');
      return response;
    } catch (error) {
      this.logger.error('Chat service error:', error);
      return 'Sorry, I encountered an error processing your message. Please try again.';
    }
  }

  async processUserMessage(userMessage: string, username: string): Promise<ChatMessage | void> {
    try {
      // Save user message
      const userChatMessage: ChatMessage = {
        message: userMessage,
        username,
        timestamp: new Date().toISOString(),
      };
      await this.saveMessage(userChatMessage);

      const frontendResponse = await this.frontendAgent.respond(userMessage);

      if (frontendResponse.user && frontendResponse.message) { 
        const aiChatMessage: ChatMessage = {
          message: frontendResponse.message,
          username: frontendResponse.user,
          timestamp: new Date().toISOString(),
        };
        await this.saveMessage(aiChatMessage);
        return aiChatMessage;
      }
    } catch (error) {
      this.logger.error('Failed to process user message:', error);
      // Return a fallback response
      return {
        message: 'Sorry, I encountered an error. Please try again.',
        username: 'AI Assistant',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async loadChatHistory(): Promise<ChatMessage[]> {
    try {
      const data = await fs.readFile(this.chatHistoryFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, return empty array
        this.logger.log('Chat history file not found, creating new one');
        return [];
      }
      throw error;
    }
  }

  private async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      const data = JSON.stringify(messages, null, 2);
      await fs.writeFile(this.chatHistoryFile, data, 'utf-8');
    } catch (error) {
      this.logger.error('Failed to save chat history to file:', error);
      throw error;
    }
  }
}