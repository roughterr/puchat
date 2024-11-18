import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../service/authentication-service';

@Component({
  selector: 'app-puchat-type-message',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './puchat-type-message.component.html',
  styleUrl: './puchat-type-message.component.css'
})
export class PuchatTypeMessageComponent {
  /**
   * Content of the new message;
   */
  content: string = '';
  toWhom = new FormControl('');
  authenticated: boolean = false;
  private newMessageSubject: string = 'new-message';

  constructor(private websocketService: AuthenticationService) {
    websocketService.getAuthenticatedObservable().subscribe(authenticated => {
      this.authenticated = authenticated;
    });
  }

  onSend() {
    const message = {
      subject: this.newMessageSubject,
      salt: Date.now().toString(),
      content: this.content,
      toWhom: this.toWhom.getRawValue()
    };
    this.websocketService.sendMessage(message);
    // reset values
    this.content = "";
    this.toWhom.setValue("");
  }
}
