import { ConnectionContext } from "../contexts/connection-context";
import { ServerContext } from "../contexts/server-context";
import { AuthenticationController } from "./authentication-controller";
import { NewMessageController } from "./new-message-controller";

export interface AbstractController {
    /**
     * Returns the path.
     */
    subject(): string;

    /**
     * It is called when a new message of the type is received.
     * @param serverContext
     * @param connectionContext
     * @param parsedMessage
     */
    handleMessage(serverContext: ServerContext, connectionContext: ConnectionContext, parsedMessage: any): void;
}

/**
 * Controller registry.
 */
const controllers: Array<AbstractController> = [
    new AuthenticationController(),
    new NewMessageController()];

/**
 * Map where the key is the path and the value is the handler.
 */
export const controllerMap =
    new Map(controllers.map((c) => [c.subject(), c]));