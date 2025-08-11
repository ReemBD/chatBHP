import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SOCKET_CLIENT } from '@chat-bhp/core/data-access';

@Component({
  selector: 'bhp-chat-feature',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  private readonly socket = inject(SOCKET_CLIENT);

  ngOnInit() {
    this.socket.emit('sendMessage', { message: 'Hello from client!', username: 'User1' });
    this.socket.messages$.subscribe((message) => {
      console.log(message);
    });
  }
}
