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
    
    // Send chat history to newly connected client
    this.sendChatHistory(client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; username: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.log(`Received message from ${data.username}: ${data.message}`);

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
      this.server.emit('receiveMessage', {
        username: 'System',
        message: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
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

  @SubscribeMessage('clearChatHistory')
  async handleClearChatHistory(@ConnectedSocket() client: Socket): Promise<void> {
    try {
      await this.chatService.clearChatHistory();
      this.server.emit('chatHistoryCleared');
      this.logger.log('Chat history cleared by client');
    } catch (error) {
      this.logger.error('Error clearing chat history:', error);
      client.emit('error', { message: 'Failed to clear chat history' });
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