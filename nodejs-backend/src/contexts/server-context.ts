import { WebSocket } from "ws";
import { UserPasswordService } from "../service/user-password-service";

/**
 * This class will contain data specific to one WebSocket server.
 */
export class ServerContext {
    /**
     * Service class to work with users authentication.
     */
    private userService = new UserPasswordService();

    /**
     * Map of connected users. The key is used is, the value is the list of his active connections.
     */
    private connectedUsers = new Map<string, WebSocket[]>();

    constructor(private wsServer) {}

    getUserService(): UserPasswordService {
        return this.userService;
    }

    public checkInUserConnection(login: string, ws: WebSocket): void {
        const websockets: WebSocket[] = this.connectedUsers.get(login);
        if (websockets) {
            websockets.push(ws);
        } else {
            this.connectedUsers.set(login, [ws]);
        }
        // JSON.stringify won't work on a Map
        for (let [login, sessions] of this.connectedUsers) {
            console.log(
                `There is a connected user with login: ${login} and number of open sessions: ${sessions.length}`
            );
        }
    }

    /**
     * Theoretically this method could work without "login", but with "login" it will work faster.
     * @param login
     * @param ws 
     */
    public checkOutUserConnection(login: string, ws: WebSocket): void {
        console.log(`checkOutUserConnection. login=${login}, ws=${ws}`);
        
        //this.connectedUsers.get[login].remo
        //TODO
    }

    /**
     * Sends a message to all active user sessions.
     * @param login
     */
    public sendStringToUser(login: string, message: string): void {
        this.connectedUsers.get(login)?.forEach((ws) => {
            ws.send(message);
        });
    }

    public sendJsonToUser(login: string, message: any): void {
        this.sendStringToUser(login, JSON.stringify(message));
    }
}
