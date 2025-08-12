import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import OpenAI from 'openai';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenAI],
})
export class AppModule { }
