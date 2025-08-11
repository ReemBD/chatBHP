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

  @WebSocketGateway({ cors: { origin: '*' } }) // Configure CORS as needed
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket, ...args: any[]): void {
      console.log(`Client connected: ${client.id}`);
      // You might want to emit a 'userConnected' event to other clients
    }

    handleDisconnect(client: Socket): void {
      console.log(`Client disconnected: ${client.id}`);
      // You might want to emit a 'userDisconnected' event
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
      @MessageBody() data: { message: string; username: string },
      @ConnectedSocket() client: Socket,
    ): void {
      console.log(`Received message from ${data.username}: ${data.message}`);
      // Broadcast the message to all connected clients (or specific rooms)
      this.server.emit('receiveMessage', {
        username: data.username,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    }
  }