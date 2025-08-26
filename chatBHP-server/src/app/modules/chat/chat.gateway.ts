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
import { CLIENT_SOCKET_EVENTS, SERVER_SOCKET_EVENTS } from '@chat-bhp/core/api-types';

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

  @SubscribeMessage(CLIENT_SOCKET_EVENTS.chatJoin)
  async handleJoinChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('handleJoinChat', data);
    this.joinChat(client, data.username);
  }

  private joinChat(client: Socket, username: string): void {
    this.server.emit('chatJoin', { userId: client.id, username });
  }

  @SubscribeMessage(CLIENT_SOCKET_EVENTS.chatLeave)
  async handleLeaveChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.leaveChat(client, data.username);
  }

  private leaveChat(client: Socket, username: string): void {
    this.server.emit(SERVER_SOCKET_EVENTS.chatLeave, { userId: client.id, username });
  }

  @SubscribeMessage(CLIENT_SOCKET_EVENTS.chatMessage)
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
      this.server.emit(SERVER_SOCKET_EVENTS.chatMessage, userMessage);

      // Process message through chat service
      const aiResponse = await this.chatService.processUserMessage(data.message, data.username);

      // Broadcast the AI response
      aiResponse && this.server.emit(SERVER_SOCKET_EVENTS.chatMessage, aiResponse);

      this.logger.log(`AI response sent for message from ${data.username}`);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      
      // Send error message to client
      this.server.emit(SERVER_SOCKET_EVENTS.chatError, {
        details: {
          username: data.username,
        },
        error: error.message,
      });
    }
  }
}