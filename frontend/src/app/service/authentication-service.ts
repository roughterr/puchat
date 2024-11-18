import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /**
   * Notifies other components when you authenticated.
   * @private
   */
  private authenticatedSubject: Subject<any> = new Subject<boolean>();

  login(username: string, password: string) {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      console.log(`WebSocketSubject connection opened.`);
      const message = {
        login: username,
        password: password,
        subject: 'authenicate'
      };
      ws.send(JSON.stringify(message));
    };
    ws.onmessage = (message) => {
      console.log(`received message from websocket: ${message.data}`);
      if (message.data == 'authentication successful') {
        this.authenticatedSubject.next(true);
        // this.authenticated = true;
      }
    };
    ws.onclose = () => {
      alert(`WebSocketSubject connection closed.`);
      this.authenticatedSubject.next(false);
    }
  }

  /**
   * Subscribers can know when the user logged in or logged out.
   * @returns {Observable<any>}
   */
  getAuthenticatedObservable(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }
}
