import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';

@Component({
  selector: 'bhp-chat-feature',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  ngOnInit() {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    socket.on('message', (message: string) => {
      console.log(message);
    });
    socket.emit('sendMessage', { message: 'Hello from client!', username: 'User1' });
  }
}
