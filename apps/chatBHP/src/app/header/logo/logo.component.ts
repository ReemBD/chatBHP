import { UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bhp-logo',
  templateUrl: './logo.component.html',
  standalone: true,
  imports: [UpperCasePipe],
})
export class LogoComponent {

}