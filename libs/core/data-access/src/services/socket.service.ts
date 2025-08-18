import { inject, Injectable } from "@angular/core";
import { filter, fromEvent, map, merge, Observable, share, startWith } from "rxjs";
import { io, Socket } from "socket.io-client";

import { SOCKET_EVENTS, SocketEvent, SocketEventKeys } from "@chat-bhp/core/api-types";

import { SOCKET_URL } from "./api-url.token";
import { keys } from "@chat-bhp/core/utils";

/**
 * An observable based facade to emit and listen to socket events.
 * This enables us to use the socket events stream as an observable and hook into rxjs api.
 * @example
 * ```ts
 * const socketService = inject(SocketService);
 * socketService.emit('sendMessage', { message: 'Hello, world!' });
 * socketService.getEvent('receiveMessage').subscribe((event) => {
 *  console.log(event);
 */
@Injectable({
    providedIn: 'root'
})
export class SocketService extends Observable<SocketEvent> {
    private readonly socket: Socket;

    readonly connected$;

    constructor() {
        const url = inject(SOCKET_URL);
        const socket = io(url);

        super((subscriber) => {
            this.socket.connect();
            this.socket.onAny((event, data) => {
                subscriber.next({ event, data });
            });

            return () => {
                this.socket.disconnect();
            };
        });

        this.socket = socket;
        this.connected$ = merge(
            fromEvent(this.socket, SOCKET_EVENTS.connect).pipe(map(() => true)),
            fromEvent(this.socket, SOCKET_EVENTS.disconnect).pipe(map(() => false)),
        ).pipe(
            startWith(socket.connected),
            share()
        );
    }

    /**
     * Get an event from the socket.
     * @param event - The event to get.
     * @returns An observable of the event.
     */
    getEvent<T extends SocketEventKeys>(event: T): Observable<SocketEvent<T>> {
        return fromEvent(this.socket, event).pipe(map((data) => ({ event, data }))) as Observable<SocketEvent<T>>;
    }

    /**
     * Emit an event to the socket.
     * @param event - The event to emit.
     * @param data - The data to emit.
     */
    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}