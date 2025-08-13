import { ChatMessage } from "./chat";

export type MessageError = {
    details: {
        username: string;
    };
    error: string;
}

export type UserJoin = {
    userId: string;
    username: string;
}

export type UserLeave = {
    userId: string;
    username: string;
}

export type SocketEventData = {
    'chatHistory': ChatMessage[];
    'receiveMessage': ChatMessage;
    'messageError': MessageError;
    'userJoin': UserJoin;
    'userLeave': UserLeave;
}

export type SocketEventKeys = keyof SocketEventData;

export type SocketEvent<T extends SocketEventKeys = SocketEventKeys> =
    | { event: T; data: SocketEventData[T] };