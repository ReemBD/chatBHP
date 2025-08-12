import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChatMessage } from '../models/chat';
import { ChatUserColorPipe } from '../pipes/chat-user-color.pipe';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bhp-chat-message',
    templateUrl: './chat-message.component.html',
    imports: [DatePipe, ChatUserColorPipe],
    standalone: true,
})
export class ChatMessageComponent {
    readonly message = input.required<ChatMessage>();
}