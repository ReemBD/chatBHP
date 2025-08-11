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
import { FrontendAgent } from './agents/frontend.agent';

@WebSocketGateway({ cors: { origin: '*' } }) // Configure CORS as needed
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly frontendAgent: FrontendAgent) { }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
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

    this.frontendAgent
      .respond(data.message)
      .then((response) => {
        if (response) {
          this.server.emit('receiveMessage', {
            username: 'Frontend Developer Bot',
            message: response.choices[0].message.content,
            timestamp: new Date().toISOString(),
          });
        }
      });
  }
}