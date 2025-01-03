import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../service/message-service';

@Component({
  selector: 'app-puchat-type-message',
  standalone: true,
  imports: [
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
  receiver = new FormControl('');

  constructor(private messageService: MessageService) {
  }

  onSend() {
    this.messageService.sendMessage(this.content, this.receiver.getRawValue() || '');
    // reset values
    this.content = '';
  }
}
