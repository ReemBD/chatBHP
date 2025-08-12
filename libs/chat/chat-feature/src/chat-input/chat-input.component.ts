import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from '@chat-bhp/ui/button';

@Component({
  selector: 'bhp-chat-input',
  templateUrl: './chat-input.component.html',
  standalone: true,
  imports: [FormsModule, ButtonDirective],
})
export class ChatInputComponent {
  readonly message = model<string>('');
  readonly send = output<void>();

  onSend(e: Event) {
    e.preventDefault();
    if (!this.message().trim()) return;
    this.send.emit();
  }
}