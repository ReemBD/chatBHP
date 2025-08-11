import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'bhp-chat-input',
  templateUrl: './chat-input.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class ChatInputComponent {
  readonly message = model<string>('');
  readonly send = output<void>();
}