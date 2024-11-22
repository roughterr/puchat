import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageService } from '../service/message-service';

@Component({
  selector: 'app-puchat-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puchat-message-list.component.html',
  styleUrl: './puchat-message-list.component.css'
})
export class PuchatMessageListComponent {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {
    this.messages = messageService.messages;
  }
}


