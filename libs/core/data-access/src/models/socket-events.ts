import { ChatMessage } from "@chat-bhp/core/api-types";

export type MessageError = {
    details: {
        username: string;
    };
    error: string;
}

export type SocketEventData = {
    'chatHistory': ChatMessage[];
    'receiveMessage': ChatMessage;
    'messageError': MessageError;
}

export type SocketEventKeys = keyof SocketEventData;

export type SocketEvent<T extends SocketEventKeys = SocketEventKeys> =
    | { event: T; data: SocketEventData[T] };