import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.css'
})
export class LoginComponentComponent {
  username = new FormControl('');
  password = new FormControl('')

  onLogin() {
    console.log('onLogin');

    alert(`username=${this.username.getRawValue()}, password=${this.password.getRawValue()}`);
  }
}

