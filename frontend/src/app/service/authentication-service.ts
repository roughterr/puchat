import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  /**
   * Notifies other components when you authenticated.
   * @private
   */
  private authenticatedSubject: Subject<AuthenticationResult> = new Subject<AuthenticationResult>();
  /**
   * Notifies other components when you authenticated.
   * @private
   */
  private incomingMessagesSubject: Subject<any> = new Subject<any>();

  private ws: WebSocket | undefined;

  login(username: string, password: string) {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onopen = () => {
      console.log(`WebSocketSubject connection opened.`);
      const message = {
        login: username,
        password: password,
        subject: 'authenticate'
      };
      this.sendMessage(message);
    };
    this.ws.onmessage = (message) => {
      console.log(`received message from websocket: ${message.data}`);
      if (message.data == 'authentication successful') {
        this.authenticatedSubject.next(new AuthenticatedResult(username));
      } else {
        // let's parse JSON
        let jsonObj = JSON.parse(message.data);
        console.log(`subject: ${jsonObj.subject}`);
        if (jsonObj.subject == 'message') {
          this.incomingMessagesSubject.next(jsonObj);
        }
      }
    };
    this.ws.onclose = () => {
      alert(`WebSocketSubject connection closed.`);
      // forced logout because the session was dropped
      this.authenticatedSubject.next(new UnauthenticatedResult());
    };
  }

  logout() {
    // we need to think about whether we want to close the websocket connection on logout
    // this.ws?.close();
    this.authenticatedSubject.next(new UnauthenticatedResult());
  }

  sendMessage(message: any) {
    this.ws?.send(JSON.stringify(message));
  }

  /**
   * Subscribers can know when the user logged in or logged out.
   * @returns {Observable<any>}
   */
  getAuthenticatedObservable(): Observable<AuthenticationResult> {
    return this.authenticatedSubject.asObservable();
  }

  getIncomingMessagesObservable(): Observable<any> {
    return this.incomingMessagesSubject.asObservable();
  }
}

export interface AuthenticationResult {
  login?: string;
  success: boolean;
}

class UnauthenticatedResult implements AuthenticationResult {
  login?: string;
  success: boolean;

  constructor() {
    this.login = undefined;
    this.success = false;
  }
}

class AuthenticatedResult implements AuthenticationResult {
  login: string;
  success: boolean;

  constructor(login: string) {
    this.login = login;
    this.success = true;
  }
}

