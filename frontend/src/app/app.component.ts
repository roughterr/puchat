import { Component } from '@angular/core';
import { LoginComponentComponent } from './login-component/login-component.component';
import { CommonModule } from '@angular/common';
import { PuchatTypeMessageComponent } from './puchat-type-message/puchat-type-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponentComponent, CommonModule, PuchatTypeMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor() {

  }
}
