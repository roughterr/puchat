export interface MessageFromServerToClient extends NewMessage {
    /**
     * User id that the message is from. Empty means a message addressed to everyone.
     */
    fromWhom: string;
}

/**
 * Represent a data structure that represents a message that a user sends to another user.
 */
export interface NewMessage {
    /**
     * Some data that are meaningful only to the sender - not to the receiver.
     * For example, it can be a date when the client sent the message.
     * Let's say it shouldn't be longer than 60 symbols.
     */
    salt?: string;
    /**
     * Salt of the previous message. If all the previous message are acknowledged by the client, it will probably not put anything here.
     */
    previousMessageSalt?: string;
    /**
     * The content of the message.
     */
    content: string;
    /**
     * User id that the message is addressed to. Empty means a message addressed to everyone.
     */
    receiver?: string;
}
