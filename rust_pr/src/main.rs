mod contexts;
mod user_service;
mod authentication_controller;

use crate::authentication_controller::AuthenticationController;
use crate::contexts::{ConnectionContext, MessageContext, Subject};
use futures::stream::SplitSink;
use futures::{SinkExt, StreamExt};
use log::{error, info};
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::collections::HashMap;
use std::env;
use std::net::Shutdown;
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::io::AsyncWriteExt;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::Mutex;
use tokio_tungstenite::{accept_async, tungstenite::protocol::Message, WebSocketStream};

#[tokio::main]
async fn main() {
    // Initialize the logger
    env_logger::init();

    // Get the address to bind to
    let addr = env::args()
        .nth(1)
        .unwrap_or_else(|| "127.0.0.1:8080".to_string());
    let addr: SocketAddr = addr.parse().expect("Invalid address");

    // Create the TCP listener
    let listener = TcpListener::bind(&addr).await.expect("Failed to bind");

    println!("Listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {
        // Spawn a new task for each connection
        tokio::spawn(handle_connection(stream));
    }
}



trait Controller {
    fn handle(
        &self,
        connection_context: &mut ConnectionContext,
        message_context: MessageContext
    ) -> ();
}

struct NewMessageController;
impl Controller for NewMessageController {
    fn handle(&self, connection_context: &mut ConnectionContext, message_context: MessageContext) -> () {
        println!("NewMessageController is not implemented yet");
    }
}

// The static map with thread-safe controllers
static SUBJECT_TO_HANDLER: Lazy<HashMap<&'static str, Box<dyn Controller + Sync + Send>>> = Lazy::new(|| {
    let mut map: HashMap<&str, Box<dyn Controller + Sync + Send>> = HashMap::new();
    map.insert("authenicate", Box::new(AuthenticationController));
    map.insert("new-message", Box::new(NewMessageController));
    map
});

async fn handle_connection(stream: TcpStream) {
    // Accept the WebSocket connection
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            error!("Error during the websocket handshake: {}", e);
            return;
        }
    };

    // Split the WebSocket stream into a sender and receiver
    let (mut sender, mut receiver) = ws_stream.split();

    let mut connection_context = contexts::ConnectionContext::new();

    // Handle incoming messages
    while let Some(msg) = receiver.next().await {
        match msg {
            Ok(Message::Text(content)) => {
                let subject: Subject = serde_json::from_str(&content).expect("JSON was not well-formatted");
                println!("subject: {:#?}", subject);
                if let Some(handler) = SUBJECT_TO_HANDLER.get(&*subject.subject) {
                    let message_context = MessageContext {
                        content,
                        subject
                    };
                    handler.handle(&mut connection_context, message_context);
                    while let Some(msg) = connection_context.get_messages_queue().pop_front() {
                        println!("The message is: {}", msg);
                        sender
                            .send(Message::Text(msg))
                            .await
                            .expect("TODO: panic message");
                    }
                    println!("A message has been handled. connection_context.current_user_login={} :", connection_context.get_current_user_login())
                } else {
                    sender.send(Message::Text("unknown subject".to_owned())).await.expect("TODO: panic message");
                    // Close the WebSocket connection gracefully
                    sender.send(Message::Close(None)).await.expect("TODO: panic message");
                    println!("Close frame sent");
                    // sender.shutdown().await.unwrap();
                    // // Reverse the received string and send it back
                    // let reversed = text.chars().rev().collect::<String>();
                    // if let Err(e) = sender.send(Message::Text(reversed)).await {
                    //     error!("Error sending message: {}", e);
                    // }
                }
            }
            Ok(Message::Close(_)) => break,
            Ok(_) => (),
            Err(e) => {
                error!("Error processing message: {}", e);
                break;
            }
        }
    }
}
