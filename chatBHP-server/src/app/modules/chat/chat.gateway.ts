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
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Emit userJoin event to all clients
    this.server.emit('userJoin', {
      userId: client.id,
      timestamp: new Date().toISOString(),
      message: 'A new user joined the chat'
    });
    
    // Send chat history to newly connected client
    this.sendChatHistory(client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Emit userLeave event to all clients
    this.server.emit('userLeave', {
      userId: client.id,
      timestamp: new Date().toISOString(),
      message: 'A user left the chat'
    });
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

  @SubscribeMessage('getChatHistory')
  async handleGetChatHistory(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      await this.sendChatHistory(client);
    } catch (error) {
      this.logger.error('Error sending chat history:', error);
      client.emit('error', { message: 'Failed to load chat history' });
    }
  }

  private async sendChatHistory(client: Socket): Promise<void> {
    try {
      const chatHistory = await this.chatService.getChatHistory();
      client.emit('chatHistory', chatHistory);
      this.logger.log(`Sent ${chatHistory.length} messages to client ${client.id}`);
    } catch (error) {
      this.logger.error('Error loading chat history:', error);
      client.emit('chatHistory', []);
    }
  }
}