import * as WebSocket from "ws";
import { AuthenticationData } from "../controller/authentication-controller";
import { NewMessage } from "../dto/message-dto";
import { Subject } from "../dto/subject";
import { newMessageSubject } from "../controller/new-message-controller";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const ws = new WebSocket.WebSocket("ws://localhost:8080");
const rl = readline.createInterface({ input, output });

// This is script that help you send one message to any user from an input from the command line.

ws.on("open", () => {
    console.log("Connected to server");

    const message: AuthenticationData = {
        login: "ian",
        password: "ian",
        subject: "authenticate"
    };
    ws.send(JSON.stringify(message));
});

ws.on("message", (message: string) => {
    console.log(`Received message from server: ${message}`);
    if (message == "authentication successful") {
        const recursiveAsyncReadLine = function () {
            rl.question('Who are you sending your message to: ', function (username) {
                if (username == 'exit') //we need some base case, for recursion
                    return rl.close(); //closing RL and returning from function.
                rl.question('What message would you like to send to him? ', (content) => {
                    console.log(`Thank you sending the message: ${content}`);
                    const message: NewMessage & Subject = {
                        subject: newMessageSubject,
                        salt: Date.now().toString(),
                        content: content,
                        toWhom: username
                    };
                    ws.send(JSON.stringify(message));
                    recursiveAsyncReadLine(); //Calling this function again to ask new question
                });
            });
        };
        recursiveAsyncReadLine(); //we have to actually start our recursion somehow
    }
});

ws.on("close", () => {
    console.log("Disconnected from server");
});



