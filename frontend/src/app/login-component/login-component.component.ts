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

  authenticatedText: string = '';

  authenticated: boolean = false;
  showLoggedOutDiv: boolean = false;
  // showLoggedInDiv: boolean = false;
  loginExpanded: boolean = true;

  constructor(private websocketService: AuthenticationService) {
    websocketService.getAuthenticatedObservable().subscribe(result => {
      this.authenticated = result.success;
      if (this.authenticated) {
        this.loginExpanded = false;
        this.authenticatedText = `You are logged in as ${result.login}.`;
      } else {
        this.loginExpanded = true;
      }
    });
  }

  onLogin() {
    console.log('onLogin');
    this.websocketService.login(this.username.getRawValue() || '', this.password.getRawValue() || '');
  }

  onLogout() {
    // this.showGreenText = false;
    this.showLoggedOutDivDivForAFewSeconds();
    this.websocketService.logout();
  }

  private showLoggedOutDivDivForAFewSeconds() {
    this.showLoggedOutDiv = true;
    setTimeout(() => {
      this.showLoggedOutDiv = false;
    }, 3000);
  }

  // private showLoggedInDivForAFewSeconds() {
  //   this.showLoggedInDiv = true;
  //   setTimeout(() => {
  //     this.showLoggedInDiv = false;
  //   }, 3000);
  // }

  expandLogin() {
    this.loginExpanded = true;
  }

  collapseLogin() {
    this.loginExpanded = false;
  }
}

