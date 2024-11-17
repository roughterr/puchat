import bodyParser from "body-parser";
import express, { Express } from "express";
import { WebSocket } from "ws";
import { ConnectionContext } from "./contexts/connection-context";
import { ServerContext } from "./contexts/server-context";
import { controllerMap } from "./controller/abstract-controller";
import { Subject } from "./dto/subject";

const port = 8080;
const app: Express = express();

// without this the request body in Websocket will appear empty
app.use(express.urlencoded({ extended: true }));

// make content of folder "public" available in the browser
app.use(express.static("public"));

// for HTTP
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Configure routesroutes.register(app);
// start the express server
const httpServer = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
const wsServer = new WebSocket.Server({ noServer: true });

const serverContext = new ServerContext(wsServer);

wsServer.on("connection", function (ws: WebSocket) {
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
