import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';

import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatMessage } from '../models/chat';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bhp-chat-message-list',
    templateUrl: './chat-message-list.component.html',
    standalone: true,
    imports: [ChatMessageComponent],
})
export class ChatMessageListComponent {
  readonly messages = input.required<ChatMessage[]>();
  private readonly scrollArea = viewChild<ElementRef<HTMLDivElement>>('scrollArea');

  scrollToBottom() {
    this.scrollArea()?.nativeElement.scrollTo({ top: this.scrollArea()?.nativeElement.scrollHeight, behavior: 'smooth' });
  }
}