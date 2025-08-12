import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, scan } from 'rxjs';

import { SocketService } from '@chat-bhp/core/data-access';
import { USERNAME } from '@chat-bhp/chat/chat-feature';

import { ChatMessage } from './models/chat';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

@Component({
  selector: 'bhp-chat-feature',
  imports: [CommonModule, ChatMessageListComponent, ChatInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  private readonly socket$ = inject(SocketService);
  private readonly username = inject(USERNAME);

  readonly messages = signal<ChatMessage[]>([]);
  readonly currentMessage = signal<string>('');

  constructor() {

    this.socket$
      .getEvent('receiveMessage')
      .pipe(
        map(({ data }) => ({ ...data, isSender: this.username === data.username })),
        scan((acc, curr) => [curr, ...acc], [] as Array<ChatMessage>),
        takeUntilDestroyed()
      )
      .subscribe(messages => this.messages.set(messages));
  }

  onSend() {
    const tempMessage: ChatMessage = {
      message: this.currentMessage(),
      timestamp: new Date().toISOString(),
      username: 'me',
      isSender: true,
    }
    this.messages.update(messages => [tempMessage, ...messages]);
    this.socket$.emit('sendMessage', { message: this.currentMessage(), username: this.username });
    this.currentMessage.set('');
  }
}
