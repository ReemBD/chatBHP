import { afterRenderEffect, Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, tap, timer } from 'rxjs';

import { ChatService } from '@chat-bhp/chat/data-access';
import { ToasterService } from '@chat-bhp/ui/toaster';
import { LoaderComponent } from '@chat-bhp/ui/loader';

import { ChatMessage } from './models/chat';
import { ChatMessageListComponent } from './chat-message-list/chat-message-list.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { USERNAME } from './tokens/username.token';

@Component({
  selector: 'bhp-chat',
  imports: [CommonModule, ChatMessageListComponent, ChatInputComponent, LoaderComponent],
  templateUrl: './chat.component.html',
})
export class Chat implements OnInit, OnDestroy {
  private readonly toasterService = inject(ToasterService);
  private readonly chatService = inject(ChatService);
  private readonly username = inject(USERNAME);

  private readonly messageList = viewChild<ChatMessageListComponent>(ChatMessageListComponent);

  readonly messages = signal<ChatMessage[]>([]);
  readonly currentMessage = signal<string>('');
  readonly isLoading = toSignal(this.chatService.isLoading$);

  private readonly error$ = this.chatService.error$;
  private readonly chat$ = this.chatService.chat$;

  constructor() {
    // Show errors in the toaster
    this.error$
      .pipe(takeUntilDestroyed(), tap(error => console.error(error)))
      .subscribe((error) => this.toasterService.show(error).subscribe());

    // Show join/leave messages in the toaster
    this.chatService.connect$
      .pipe(
        takeUntilDestroyed(),
        filter(event => event.data.username !== this.username)
      )
      .subscribe(event => {
        const message = event.type === 'join' ? `${event.data.username} joined the chat` : `${event.data.username} left the chat`;
        this.toasterService.show(message).subscribe()
      });

    // Update the messages when the chat is updated
    this.chat$
      .pipe(takeUntilDestroyed())
      .subscribe(chat => this.messages.set(chat));

    // Scroll to the bottom of the message list when the messages change
    afterRenderEffect(() => {
      if (this.messages().length > 0) {
        this.messageList()?.scrollToBottom();
      }
    });
  }

  ngOnInit() {
    // TODO: Fix inconsistencies in the userJoin emission without the delay.
    timer(2000).subscribe(() => this.chatService.joinChat());
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
