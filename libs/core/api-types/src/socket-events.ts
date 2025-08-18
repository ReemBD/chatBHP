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
    'connect': void;
    'disconnect': void;
}

export type SocketEventKeys = keyof SocketEventData;

export type SocketEvent<T extends SocketEventKeys = SocketEventKeys> =
    | { event: T; data: SocketEventData[T] };

export const SOCKET_EVENTS: Record<SocketEventKeys, SocketEventKeys> = {
    'chatHistory': 'chatHistory',
    'receiveMessage': 'receiveMessage',
    'messageError': 'messageError',
    'userJoin': 'userJoin',
    'userLeave': 'userLeave',
    'connect': 'connect',
    'disconnect': 'disconnect',
}