import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAIService } from './openai.service';
import { ChatGateway } from './chat.gateway';
import { FrontendAgent } from './agents/frontend.agent';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, OpenAIService, FrontendAgent],
})
export class ChatModule {}