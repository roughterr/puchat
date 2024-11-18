import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WebsocketService } from '../service/websocket-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  username = new FormControl('');
  password = new FormControl('');

  constructor(private websocketService: WebsocketService) {
  }

  onLogin() {
    console.log('onLogin');
    this.websocketService.login(this.username.getRawValue() || '', this.password.getRawValue() || '');
  }
}

