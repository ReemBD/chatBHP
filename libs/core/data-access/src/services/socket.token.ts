import { inject, InjectionToken } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

import { SOCKET_URL } from './api-url.token';

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
            const messages$ = new Observable<{ event: string; data: any }>((subscriber) => {
                socket.connect();
                socket.onAny((event, data) => {
                    subscriber.next({ event, data });
                });

                return () => {
                    socket.disconnect();
                };
            });

            return {
                messages$,
                emit: (event: string, data: any) => socket.emit(event, data),
            };
        },
    });