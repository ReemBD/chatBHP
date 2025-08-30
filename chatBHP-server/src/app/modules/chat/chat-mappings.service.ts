import { Injectable } from '@nestjs/common';
import { ChatMappings, ChatTopic, ChatMessage } from '@chat-bhp/core/api-types';

@Injectable()
export class ChatMappingsService {
  private readonly chatMappings: ChatMappings = {
    topicWelcomeMessageMap: {
      frontend: {
        message: 'Welcome to the Frontend Development chat! I\'m here to help you with all things frontend - from HTML and CSS to modern JavaScript frameworks like React, Angular, and Vue. What would you like to know?',
        username: 'Frontend Assistant',
        timestamp: new Date().toISOString()
      }
    }
  };

  getChatMappings(): ChatMappings {
    return this.chatMappings;
  }

  getWelcomeMessage(topic: ChatTopic): ChatMessage {
    return this.chatMappings.topicWelcomeMessageMap[topic];
  }
}
