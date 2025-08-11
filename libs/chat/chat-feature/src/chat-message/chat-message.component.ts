import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChatMessage } from '@chat-bhp/core/api-types';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bhp-chat-message',
    templateUrl: './chat-message.component.html',
    imports: [DatePipe],
    standalone: true,
})
export class ChatMessageComponent {
    readonly message = input.required<ChatMessage>();
    readonly isSender = input.required<boolean>();
}