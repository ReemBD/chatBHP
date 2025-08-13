import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import OpenAI from 'openai';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static/browser'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenAI],
})
export class AppModule { }
