import * as WebSocket from "ws";
import { AuthenticationData } from "../controller/authentication-controller";
import { NewMessage } from "../dto/message-dto";
import { Subject } from "../dto/subject";

const ws = new WebSocket.WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to server");

    const message: AuthenticationData = {
        login: "dan",
        password: "dan",
        subject: "authenticate"
    };
    ws.send(JSON.stringify(message));
});

ws.on("message", (message: string) => {
    console.log(`Received message from server: ${message}`);
    if (message == "authentication successful") {
        const message: NewMessage & Subject = {
            salt: Date.now().toString(),
            content: "hi ian. how are you?",
            subject: "new-message",
            toWhom: "ian"
        };
        ws.send(JSON.stringify(message));
    }
});

ws.on("close", () => {
    console.log("Disconnected from server");
});
