import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /**
   * Notifies other components when you authenticated.
   * @private
   */
  private authenticatedSubject: Subject<boolean> = new Subject<boolean>();

  private ws: WebSocket | undefined;

  login(username: string, password: string) {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onopen = () => {
      console.log(`WebSocketSubject connection opened.`);
      const message = {
        login: username,
        password: password,
        subject: 'authenicate'
      };
      this.sendMessage(message);
    };
    this.ws.onmessage = (message) => {
      console.log(`received message from websocket: ${message.data}`);
      if (message.data == 'authentication successful') {
        this.authenticatedSubject.next(true);
      } else {
        //TODO let's parse JSON
      }
    };
    this.ws.onclose = () => {
      alert(`WebSocketSubject connection closed.`);
      // forced logout because the session was dropped
      this.authenticatedSubject.next(false);
    }
  }

  logout() {
    // we need to think about whether we want to close the websocket connection on logout
    // this.ws?.close();
    this.authenticatedSubject.next(false);
  }

  sendMessage(message: any) {
    this.ws?.send(JSON.stringify(message));
  }

  /**
   * Subscribers can know when the user logged in or logged out.
   * @returns {Observable<any>}
   */
  getAuthenticatedObservable(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }
}
