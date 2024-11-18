import { Component } from '@angular/core';
import { LoginComponentComponent } from './login-component/login-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponentComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor() {

  }
}
