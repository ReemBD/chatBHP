import { inject, InjectionToken } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

import { ChatMessage } from '@chat-bhp/core/api-types';

import { SOCKET_URL } from './api-url.token';

export type SocketEvent = {
    event: 'receiveMessage';
    data: ChatMessage;
}

export const generateUsername = () => {
    return `user_${Math.floor(Math.random() * 1000000)}`;
};

/**
 * The client socket instance as an injectable token with concrete implementation.
 * @return messages$ - An observable that emits the messages from the server.
 * @return emit - A function that emits a message to the server.
 */
export const SOCKET_CLIENT = new InjectionToken(
    'The client socket instance as an injectable token with concrete implementation.',
    {
        providedIn: 'root',
        factory: () => {
            const url = inject(SOCKET_URL);
            const socket = io(url);
            const messages$ = new Observable<SocketEvent>((subscriber) => {
                socket.connect();
                socket.onAny((event, data) => {
                    subscriber.next({ event, data });
                });

                return () => {
                    socket.disconnect();
                };
            });

            return {
                username: generateUsername(),
                messages$,
                emit: (event: string, data: any) => socket.emit(event, data),
            };
        },
    });