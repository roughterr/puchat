import { Component } from '@angular/core';
import { LoginComponentComponent } from './login-component/login-component.component';
import { CommonModule, NgIf } from '@angular/common';
import { PuchatTypeMessageComponent } from './puchat-type-message/puchat-type-message.component';
import { AuthenticationService } from './service/authentication-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponentComponent, CommonModule, PuchatTypeMessageComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  authenticated: boolean = false;

  constructor(private websocketService: AuthenticationService) {
    websocketService.getAuthenticatedObservable().subscribe(authenticated => {
      this.authenticated = authenticated;
    });
  }
}
