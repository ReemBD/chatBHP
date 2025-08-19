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

  @SubscribeMessage('chatJoin')
  async handleJoinChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.joinChat(client, data.username);
  }

  private joinChat(client: Socket, username: string): void {
    this.server.emit('chatJoin', { userId: client.id, username });
  }

  @SubscribeMessage('chatLeave')
  async handleLeaveChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.leaveChat(client, data.username);
  }

  private leaveChat(client: Socket, username: string): void {
    this.server.emit('chatLeave', { userId: client.id, username });
  }

  @SubscribeMessage('chatMessage')
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
      this.server.emit('chatMessage', userMessage);

      // Process message through chat service
      const aiResponse = await this.chatService.processUserMessage(data.message, data.username);

      // Broadcast the AI response
      aiResponse && this.server.emit('chatMessage', aiResponse);

      this.logger.log(`AI response sent for message from ${data.username}`);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      
      // Send error message to client
      this.server.emit('chatError', {
        details: {
          username: data.username,
        },
        error: error.message,
      });
    }
  }
}