import { ConnectionContext } from "../contexts/connection-context";
import { ServerContext } from "../contexts/server-context";
import { AbstractController } from "./abstract-controller";
import { MessageFromServerToClient, NewMessage } from "../dto/message-dto";
import { Subject } from "../dto/subject";

export const newMessageSubject: string = "new-message";

export class NewMessageController implements AbstractController {
    subject(): string {
        return newMessageSubject;
    }

    handleMessage(serverContext: ServerContext, connectionContext: ConnectionContext, parsedMessage: any): void {
        const newMessage: NewMessage = parsedMessage;
        const messageToSend: MessageFromServerToClient & Subject = {
            salt: "",
            content: newMessage.content,
            subject: "new-message",
            fromWhom: newMessage.toWhom
        };
        serverContext.sendJsonToUser(newMessage.toWhom, messageToSend);
    }
}
