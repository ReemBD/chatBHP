import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.leaveChat(client, 'unknown');
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.joinChat(client, data.username);
  }

  private joinChat(client: Socket, username: string): void {
    this.server.emit('userJoin', { userId: client.id, username });
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.leaveChat(client, data.username);
  }

  private leaveChat(client: Socket, username: string): void {
    this.server.emit('userLeave', { userId: client.id, username });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      // Broadcast the user message immediately
      const userMessage = {
        username: data.username,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      this.server.emit('receiveMessage', userMessage);

      // Process message through chat service
      const aiResponse = await this.chatService.processUserMessage(data.message, data.username);

      // Broadcast the AI response
      aiResponse && this.server.emit('receiveMessage', aiResponse);

      this.logger.log(`AI response sent for message from ${data.username}`);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      
      // Send error message to client
      this.server.emit('messageError', {
        details: {
          username: data.username,
        },
        error: error.message,
      });
    }
  }
}