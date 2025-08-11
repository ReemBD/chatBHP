import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, scan } from 'rxjs';

import { SOCKET_CLIENT } from '@chat-bhp/core/data-access';
import { ChatMessage } from '@chat-bhp/core/api-types';

import { ChatMessageComponent } from './chat-message/chat-message.component';

@Component({
  selector: 'bhp-chat-feature',
  imports: [CommonModule, ChatMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  private readonly socket = inject(SOCKET_CLIENT);

  private readonly messages$ = this.socket.messages$.pipe(
    filter(({ event }) => event === 'receiveMessage'),
    map(({ data }) => data),
    scan((acc, curr) => [...acc, curr], [] as Array<ChatMessage>),
  );

  readonly messages = toSignal(this.messages$);
}
