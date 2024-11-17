import { WebSocket } from "ws";
import { ServerContext } from "./server-context";

/**
 * This class will contain data specific to one WebSocket connection.
 */
export class ConnectionContext {
    /**
     * The context of the whole WebSocket server.
     */
    private serverContext: ServerContext;
    /**
     * The WebSocket connection object.
     */
    private ws: WebSocket;
    /**
     * Whether the user has authenticated.
     */
    private authenticated: boolean;
    /**
     * makes sense ony when "authenticated" is true
     */
    private currentUserLogin!: string;

    constructor(serverContext: ServerContext, ws: WebSocket) {
        this.serverContext = serverContext;
        this.ws = ws;
        this.authenticated = false;
    }

    /**
     * Marks the user as authenticated.
     * @param login user login
     */
    public authenticateUser(login: string) {
        this.currentUserLogin = login;
        this.authenticated;
        //add users to the server context
        this.serverContext.checkInUserConnection(login, this.ws);
    }

    /**
     * Close connection only if the user is messing around.
     */
    public closeConnection() {
        this.ws.close();
    }

    public sendJsonToUser(json: any) {
        this.sendStringToUser(JSON.stringify(json));
    }

    public sendStringToUser(message: string) {
        this.ws.send(message);
    }

    /**
     * This method must be called after the connection was closed.
     */
    public close(): void {
        this.serverContext.checkOutUserConnection(this.currentUserLogin, this.ws);
        this.authenticated = false;
        this.currentUserLogin = null;
    }
}
