import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatMessage } from '../models/chat';
import { isChatBotName } from '@chat-bhp/core/api-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bhp-chat-message-title',
  templateUrl: './chat-message-title.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ChatMessageTitleComponent {
    readonly message = input.required<ChatMessage>();

    readonly isChatBot = computed(() => isChatBotName(this.message().username));
}