import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToasterComponent, ToasterService } from '@chat-bhp/ui/toaster';
import { HeaderComponent } from './header/header.component';

@Component({
  imports: [RouterModule, ToasterComponent, AsyncPipe, HeaderComponent],
  selector: 'bhp-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly toasterService = inject(ToasterService);
}
