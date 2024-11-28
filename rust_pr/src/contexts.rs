use std::collections::VecDeque;
use serde::Deserialize;

/**
* General structure for every readable message.
*/
#[derive(Debug, Deserialize)]
pub struct Subject {
    pub subject: String,
}

pub struct ConnectionContext {
    authenticated: bool,
    current_user_login: String,
    messages_to_send_back: VecDeque<String>,
}

impl ConnectionContext {
    // Constructor to create a new instance of ConnectionContext
    pub fn new() -> Self {
        ConnectionContext {
            current_user_login: "".to_string(),
            authenticated: false,
            messages_to_send_back: VecDeque::new(),
        }
    }

    // Getter method for current_user_login
    pub fn get_current_user_login(&self) -> &str {
        &self.current_user_login
    }

    // Getter method for the authentication status
    pub fn is_authenticated(&self) -> bool {
        self.authenticated
    }

    // Method to authenticate the user
    pub fn authenticate(&mut self, username: String) {
        // For simplicity, we assume the user is authenticated here
        // You could add logic to authenticate based on a password or other factors
        self.authenticated = true;
        self.current_user_login = username;
    }

    // Method to log out the user
    pub fn logout(&mut self) {
        self.authenticated = false;
        self.current_user_login = "".to_string();
    }

    pub fn push_message(&mut self, message: String) {
        println!("push_message: {}", message);
        self.messages_to_send_back.push_back(message)
    }

    pub fn get_messages_queue(&mut self) -> &mut VecDeque<String> {
        &mut self.messages_to_send_back
    }
}

pub struct MessageContext {
    pub content: String,
    pub subject: Subject
}
