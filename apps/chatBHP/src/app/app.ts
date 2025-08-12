import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToasterComponent, ToasterService } from '@chat-bhp/ui/toaster';

@Component({
  imports: [RouterModule, ToasterComponent, AsyncPipe],
  selector: 'bhp-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly toasterService = inject(ToasterService);
}
