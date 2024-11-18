import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../service/authentication-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  username = new FormControl('');
  password = new FormControl('');

  authenticated: boolean = false;
  showLoggedOutDiv: boolean = false;
  showLoggedInDiv: boolean = false;

  constructor(private websocketService: AuthenticationService) {
    websocketService.getAuthenticatedObservable().subscribe(authenticated => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.showLoggedInDivForAFewSeconds()
      }
    });
  }

  onLogin() {
    console.log('onLogin');
    this.websocketService.login(this.username.getRawValue() || '', this.password.getRawValue() || '');
  }

  onLogout() {
    this.showLoggedOutDivDivForAFewSeconds();
    this.authenticated = false;
  }

  private showLoggedOutDivDivForAFewSeconds() {
    this.showLoggedOutDiv = true;
    setTimeout(() => {
      this.showLoggedOutDiv = false;
    }, 3000);
  }

  private showLoggedInDivForAFewSeconds() {
    this.showLoggedInDiv = true;
    setTimeout(() => {
      this.showLoggedInDiv = false;
    }, 3000);
  }
}

