import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ChatMessage } from '@chat-bhp/core/api-types';

import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bhp-chat-message-list',
    templateUrl: './chat-message-list.component.html',
    standalone: true,
    imports: [ChatMessageComponent],
})
export class ChatMessageListComponent {
  readonly messages = input.required<ChatMessage[]>();
}