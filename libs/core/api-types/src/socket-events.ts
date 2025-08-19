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

export type SocketServerEventData = {
    'chatHistory': ChatMessage[];
    'receiveMessage': ChatMessage;
    'messageError': MessageError;
    'userJoin': UserJoin;
    'userLeave': UserLeave;
    'connect': void;
    'disconnect': void;
}

export type SocketServerEventKeys = keyof SocketServerEventData;

export type SocketServerEvent<T extends SocketServerEventKeys = SocketServerEventKeys> =
    | { event: T; data: SocketServerEventData[T] };

export const SOCKET_SERVER_EVENTS: Record<SocketServerEventKeys, SocketServerEventKeys> = {
    'chatHistory': 'chatHistory',
    'receiveMessage': 'receiveMessage',
    'messageError': 'messageError',
    'userJoin': 'userJoin',
    'userLeave': 'userLeave',
    'connect': 'connect',
    'disconnect': 'disconnect',
}

export type SocketClientEventData = {
    'sendMessage': Omit<ChatMessage, 'timestamp'>;
    'joinChat': Omit<UserJoin, 'userId'>;
    'leaveChat': Omit<UserLeave, 'userId'>;
}

export type SocketClientEventKeys = keyof SocketClientEventData;

export type SocketClientEvent<T extends SocketClientEventKeys = SocketClientEventKeys> =
    | { event: T; data: SocketClientEventData[T] };

export const SOCKET_OUTPUT_EVENTS: Record<SocketClientEventKeys, SocketClientEventKeys> = {
    'sendMessage': 'sendMessage',
    'joinChat': 'joinChat',
    'leaveChat': 'leaveChat',
}