import { ConnectionContext } from "../contexts/connection-context";
import { ServerContext } from "../contexts/server-context";
import { AbstractController } from "./abstract-controller";
import { Subject } from "../dto/subject";

export const authenicateSubject: string = "authenicate";

export class AuthenticationController implements AbstractController {
    subject(): string {
        return authenicateSubject;
    }

    handleMessage(serverContext: ServerContext, connectionContext: ConnectionContext, parsedMessage: any): void {
        const aData: AuthenticationData = parsedMessage;
        if (
            aData.login &&
            aData.password &&
            serverContext.getUserService().areCredentialsCorrect(aData.login, aData.password)
        ) {
            connectionContext.authenticateUser(aData.login);
            connectionContext.sendStringToUser("authentication successful");
        } else {
            connectionContext.sendStringToUser("provide correct login and password for authentication");
            // let's later implement an automatical disconnect if the user hasn't logged in in a specific amount of time
            //connectionContext.closeConnection();
        }
    }
}

/**
 * Represents data format for an authentication message sent by a WebSocket channel.
 */
export interface AuthenticationData extends Subject {
    login: string;
    password: string;
}
