import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication-service';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private newMessageSubject: string = 'new-message';
  messages: Message[] = [];

  constructor(private authenticationService: AuthenticationService) {
  }

  /**
   * Sends a message to another user.
   * @param content
   * @param toWhom
   */
  public sendMessage(content: string, toWhom: string) {
    const message = new Message();
    message.content = content;
    message.mine = true;
    this.messages.push(message);
    // the actual sending
    this.authenticationService.sendMessage({
      subject: this.newMessageSubject,
      salt: Date.now().toString(),
      content: content,
      toWhom: toWhom
    });
  }
}

export class Message {
  /**
   * Indicates whether the current user is the author of the message.
   */
  mine: boolean = false;
  /**
   * The content of the message.
   */
  content: string = '';
  /**
   * This one makes sense only if "mine" is false.
   */
  fromWhom: string = '';
  /**
   * Time when the server acknowledged the message.
   */
  serverAckDate: string = '';
  /**
   * This one makes sense only if "mine" is true.
   */
  delivered: boolean = false;
}
