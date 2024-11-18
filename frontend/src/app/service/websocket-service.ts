import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  // authenticated: boolean = false;

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
        alert("You're logged in successfully!")
        // this.authenticated = true;
      }
    };
    ws.onclose = () => {
      alert(`WebSocketSubject connection closed.`)
    }
  }
}
