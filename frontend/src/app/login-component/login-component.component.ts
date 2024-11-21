import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../service/authentication-service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  username = new FormControl('');
  password = new FormControl('');

  authenticated: boolean = false;
  showLoggedOutDiv: boolean = false;
  showLoggedInDiv: boolean = false;
  loginExpanded: boolean = false;

  constructor(private websocketService: AuthenticationService, private http: HttpClient) {
    websocketService.getAuthenticatedObservable().subscribe(authenticated => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.showLoggedInDivForAFewSeconds();
        this.loginExpanded = false;
      }
    });
  }

  private getCredentials(): LoginCredentials {
    return new LoginCredentials(this.username.getRawValue() || '', this.password.getRawValue() || '');
  }

  onLogin() {
    console.log('onLogin');
    // this.websocketService.login(this.username.getRawValue() || '', this.password.getRawValue() || '');

    this.http.post<any>('http://localhost:8080/login', this.getCredentials()
    ).subscribe({
      next: data => {
        // username: this.username.getRawValue();
        // password: this.password.getRawValue();
      },
      error: error => {
        // this.errorMessage = error.message;
        console.error('There was an error!', error);
      }
    });
  }

  onLogout() {
    this.showLoggedOutDivDivForAFewSeconds();
    this.websocketService.logout();
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

  expandLogin() {
    this.loginExpanded = true;
  }

  collapseLogin() {
    this.loginExpanded = false;
  }
}

class LoginCredentials {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  username: string;
  password: string;
}
