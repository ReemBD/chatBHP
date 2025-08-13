import { afterRenderEffect, Component, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ChatService } from '@chat-bhp/chat/data-access';
import { ToasterService } from '@chat-bhp/ui/toaster';

import { ChatMessage } from './models/chat';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

@Component({
  selector: 'bhp-chat',
  imports: [CommonModule, ChatMessageListComponent, ChatInputComponent],
  templateUrl: './chat.component.html',
})
export class Chat {
  readonly toasterService = inject(ToasterService);
  private readonly chatService = inject(ChatService);

  private readonly messageList = viewChild<ChatMessageListComponent>(ChatMessageListComponent);

  readonly messages = signal<ChatMessage[]>([]);
  readonly currentMessage = signal<string>('');

  private readonly error$ = this.chatService.error$;
  private readonly chat$ = this.chatService.chat$;

  constructor() {
    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe((error) => this.toasterService.show(error).subscribe());

    this.chatService.connect$
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        const message = event.type === 'join' ? `${event.data.username} joined the chat` : `${event.data.username} left the chat`;
        this.toasterService.show(message).subscribe()
      });

    this.chat$
      .pipe(takeUntilDestroyed())
      .subscribe(chat => this.messages.set(chat));

    afterRenderEffect(() => {
      if (this.messages().length > 0) {
        this.messageList()?.scrollToBottom();
      }
    });
  }

  ngOnInit() {
    this.chatService.joinChat();
  }

  ngOnDestroy() {
    this.chatService.leaveChat();
  }

  onSend() {
    const tempMessage = this.chatService.createTempMessage(this.currentMessage());
    this.messages.update(messages => [tempMessage, ...messages]);
    this.chatService.sendMessage(this.currentMessage());
    this.currentMessage.set('');
  }
}
