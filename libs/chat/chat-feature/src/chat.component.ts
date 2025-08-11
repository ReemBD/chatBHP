import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, scan } from 'rxjs';

import { ReceiveMessageData, SOCKET_CLIENT } from '@chat-bhp/core/data-access';

@Component({
  selector: 'bhp-chat-feature',
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  private readonly socket = inject(SOCKET_CLIENT);

  private readonly messages$ = this.socket.messages$.pipe(
    filter(({ event }) => event === 'receiveMessage'),
    map(({ data }) => data),
    scan((acc, curr) => [...acc, curr], [] as Array<ReceiveMessageData>),
  );

  readonly messages = toSignal(this.messages$);

  ngOnInit() {
    this.socket.emit('sendMessage', { message: 'Hello from client!', username: 'User1' });
    this.socket.emit('sendMessage', { message: 'Hello from client!', username: 'User1' });
    this.socket.emit('sendMessage', { message: 'Hello from client!', username: 'User1' });
  }
}
