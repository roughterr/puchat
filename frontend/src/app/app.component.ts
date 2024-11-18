import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponentComponent} from './login-component/login-component.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponentComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  unauthorized: boolean = true;
}
