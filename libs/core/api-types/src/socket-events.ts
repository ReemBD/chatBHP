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
export const SOCKET_EVENTS = {
    'chatHistory': 'chatHistory',
    'chatMessage': 'chatMessage',
    'chatError': 'chatError',
    'chatJoin': 'chatJoin',
    'chatLeave': 'chatLeave',
    'connect': 'connect',
    'disconnect': 'disconnect',
} as const;

export type SocketEvents = typeof SOCKET_EVENTS;
export type SocketEventKeys = SocketEvents[keyof SocketEvents];

// Event data types for both client and server
export type SocketEventData = {
    [SOCKET_EVENTS.chatHistory]: ChatMessage[];
    [SOCKET_EVENTS.chatMessage]: ChatMessage;
    [SOCKET_EVENTS.chatError]: MessageError;
    [SOCKET_EVENTS.chatJoin]: UserJoin;
    [SOCKET_EVENTS.chatLeave]: UserLeave;
    [SOCKET_EVENTS.connect]: void;
    [SOCKET_EVENTS.disconnect]: void;
}

// Client event data (what client sends)
export type SocketClientEventData = {
    [SOCKET_EVENTS.chatMessage]: Omit<ChatMessage, 'timestamp'>;
    [SOCKET_EVENTS.chatJoin]: Omit<UserJoin, 'userId'>;
    [SOCKET_EVENTS.chatLeave]: Omit<UserLeave, 'userId'>;
}

export type SocketClientEventKeys = keyof SocketClientEventData;

// Event types
export type SocketEvent<T extends SocketEventKeys = SocketEventKeys> = { event: T; data: SocketEventData[T] };

export type SocketClientEvent<T extends SocketClientEventKeys = SocketClientEventKeys> = { event: T; data: SocketClientEventData[T] };
