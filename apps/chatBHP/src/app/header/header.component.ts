import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoComponent } from './logo/logo.component';
import { USERNAME } from '@chat-bhp/chat/chat-feature';

@Component({
  selector: 'bhp-header',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly username = inject(USERNAME);
}