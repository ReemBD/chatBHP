import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap } from 'rxjs';

import { SocketService } from '@chat-bhp/core/data-access';
import { USERNAME } from '@chat-bhp/chat/chat-feature';
import { ChatService } from '@chat-bhp/chat/data-access';
import { ToasterService } from '@chat-bhp/ui/toaster';

import { ChatMessage } from './models/chat';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

@Component({
  selector: 'bhp-chat',
  imports: [CommonModule, ChatMessageListComponent, ChatInputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class Chat {
  private readonly toasterService = inject(ToasterService);
  private readonly socketService = inject(SocketService);
  private readonly chatService = inject(ChatService)
  private readonly username = inject(USERNAME);
  
  readonly messages = signal<ChatMessage[]>([]);
  readonly currentMessage = signal<string>('');

  private readonly error$ = this.chatService.error$;
  private readonly chat$ = this.chatService.chat$;

  constructor() {
    this.error$
      .pipe(
        concatMap(error => this.toasterService.show(error.message)),
        takeUntilDestroyed()
      )
      .subscribe();
    this.chat$
      .pipe(takeUntilDestroyed())
      .subscribe(chat => this.messages.set(chat));
  }

  onSend() {
    const tempMessage: ChatMessage = {
      message: this.currentMessage(),
      timestamp: new Date().toISOString(),
      username: this.username,
      isSender: true,
    };
    this.messages.update(messages => [tempMessage, ...messages]);
    this.socketService.emit('sendMessage', { message: this.currentMessage(), username: this.username });
    this.currentMessage.set('');
  }
}
