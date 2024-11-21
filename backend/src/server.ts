import bodyParser from "body-parser";
import express, { Express } from "express";
import { WebSocket } from "ws";
import { ConnectionContext } from "./contexts/connection-context";
import { ServerContext } from "./contexts/server-context";
import { controllerMap } from "./controller/abstract-controller";
import { Subject } from "./dto/subject";
import { LoginResult, UserPasswordService } from "./service/user-password-service";
import cors from "cors";

const port = 8080;
const app: Express = express();

// Configure CORS to allow requests from http://localhost:4200
app.use(cors({
    origin: 'http://localhost:4200' // Specify the allowed origin
}));

// without this the request body in Websocket will appear empty
app.use(express.urlencoded({ extended: true }));

// make content of this folder available in the browser
app.use(express.static("../frontend/dist/frontend/browser"));

// for HTTP
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const usePasswordService = new UserPasswordService();

app.post("/login", (req, res) => {
    console.log(`/login request`);
    const loginResult = usePasswordService.login(req.body.username, req.body.password);
    if (loginResult.successful) {
        console.log(`user ${req.body.username} logged in successfully`);
        res.writeHead(200, {
            "Set-Cookie": "token=" + loginResult.token,
            "Access-Control-Allow-Credentials": "true"
        }).send();
    } else {
        console.log(`user ${req.body.username} could not log in`);
        res.status(401).json({ error: "Please provide correct username and password" });
    }
});

// Configure routesroutes.register(app);
// start the express server
const httpServer = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
const wsServer = new WebSocket.Server({ noServer: true });

const serverContext = new ServerContext(wsServer);

wsServer.on("connection", function(ws: WebSocket) {
    console.log("New ws connection");
    const connectionContext = new ConnectionContext(serverContext, ws);
    // listening to new messages
    ws.on("message", (messageStr: string) => {
        console.log(`received message for a client: "${messageStr}"`);
        const parsedMessage: Subject = JSON.parse(messageStr);
        controllerMap.get(parsedMessage.subject)!.handleMessage(serverContext, connectionContext, parsedMessage);
    });

    ws.on("close", () => {
        // tell your wrapper that you are dead
        connectionContext.close();
        console.log("Client disconnected");
    });
});

httpServer.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit("connection", ws, req);
    });
});
