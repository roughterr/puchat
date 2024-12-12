use std::borrow::Borrow;

use crate::contexts::{ConnectionContext, MessageContext};
use crate::{user_service, Controller, ControllerAnswer};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct LoginCredentials {
    login: String,
    password: String,
}

pub struct AuthenticationController;
impl Controller for AuthenticationController {
    fn handle(
        &self,
        connection_context: &mut ConnectionContext,
        message_context: MessageContext,
    ) -> ControllerAnswer {
        let mut login_credentials: LoginCredentials =
            serde_json::from_str(&message_context.content).expect("JSON was not well-formatted");
        let is_password_correct = user_service::are_credentials_correct(
            &login_credentials.login,
            &login_credentials.password,
        );
        println!("is_password_correct = {}", is_password_correct);
        if is_password_correct {
            connection_context.authenticate(login_credentials.login.clone());
            connection_context.push_message("authentication successful".to_string());
            connection_context
                .push_message("authentication successful (just a reminder)".to_string());
            ControllerAnswer {
                answer_type: crate::ControllerAnswerType::AssignConnectionToUser,
                username: Some(login_credentials.login.clone())
            }
        } else {
            connection_context
                .push_message("provide correct login and password for authentication".to_string());
            ControllerAnswer {
                answer_type: crate::ControllerAnswerType::Nothing,
                username: None
            }
        }
    }
}
