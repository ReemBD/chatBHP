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

// Unified socket events with neutral names
export const SERVER_SOCKET_EVENTS = {
    'chatHistory': 'chatHistory',
    'chatMessage': 'chatMessage',
    'chatError': 'chatError',
    'chatJoin': 'chatJoin',
    'chatLeave': 'chatLeave',
    'connect': 'connect',
    'disconnect': 'disconnect',
} as const;

export const CLIENT_SOCKET_EVENTS = {
    'chatMessage': 'client_chatMessage',
    'chatJoin': 'client_chatJoin',
    'chatLeave': 'client_chatLeave',
} as const;

export type SocketEvents = typeof SERVER_SOCKET_EVENTS;
export type SocketEventKeys = SocketEvents[keyof SocketEvents];

// Event data types for both client and server
export type SocketEventData = {
    [SERVER_SOCKET_EVENTS.chatHistory]: ChatMessage[];
    [SERVER_SOCKET_EVENTS.chatMessage]: ChatMessage;
    [SERVER_SOCKET_EVENTS.chatError]: MessageError;
    [SERVER_SOCKET_EVENTS.chatJoin]: UserJoin;
    [SERVER_SOCKET_EVENTS.chatLeave]: UserLeave;
    [SERVER_SOCKET_EVENTS.connect]: void;
    [SERVER_SOCKET_EVENTS.disconnect]: void;
}

// Client event data (what client sends)
export type SocketClientEventData = {
    [CLIENT_SOCKET_EVENTS.chatMessage]: Omit<ChatMessage, 'timestamp'>;
    [CLIENT_SOCKET_EVENTS.chatJoin]: Omit<UserJoin, 'userId'>;
    [CLIENT_SOCKET_EVENTS.chatLeave]: Omit<UserLeave, 'userId'>;
}

export type SocketClientEventKeys = keyof SocketClientEventData;

// Event types
export type SocketEvent<T extends string = string> = { event: T; data: any };

export type SocketClientEvent<T extends SocketClientEventKeys = SocketClientEventKeys> = { event: T; data: SocketClientEventData[T] };
