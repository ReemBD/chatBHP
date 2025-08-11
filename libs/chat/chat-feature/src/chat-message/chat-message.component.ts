import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChatMessage } from '../models/chat';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bhp-chat-message',
    templateUrl: './chat-message.component.html',
    imports: [DatePipe],
    standalone: true,
})
export class ChatMessageComponent {
    readonly message = input.required<ChatMessage>();
}