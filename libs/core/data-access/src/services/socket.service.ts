import { inject, Injectable, OnDestroy } from "@angular/core";
import { fromEvent, map, merge, Observable, share, startWith, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";

import { SOCKET_EVENTS, SocketEvent, SocketEventKeys, SocketClientEvent } from "@chat-bhp/core/api-types";

import { SOCKET_URL } from "./api-url.token";

/**
 * A Subject based facade to emit and listen to socket events.
 * This enables us to use the socket events stream as an observable and hook into rxjs api.
 * The next method is overridden to emit events to the socket.
 * @example
 * ```ts
 * const socketService = inject(SocketService);
 * socketService.next({ event: 'chatMessage', data: { message: 'Hello, world!' } });
 * socketService.getEvent(SOCKET_EVENTS.chatMessage).subscribe((event) => {
 *  console.log(event);
 * });
 */
@Injectable({
    providedIn: 'root'
})
export class SocketService extends Subject<SocketEvent> implements OnDestroy {
    private readonly socket: Socket;

    readonly connected$;

    constructor() {
        const url = inject(SOCKET_URL);
        const socket = io(url);

        socket.connect();
        socket.onAny((event, data) => {
            this.next({ event, data });
        });

        super();

        this.socket = socket;
        this.connected$ = merge(
            fromEvent(this.socket, SOCKET_EVENTS.connect).pipe(map(() => true)),
            fromEvent(this.socket, SOCKET_EVENTS.disconnect).pipe(map(() => false)),
        ).pipe(
            startWith(socket.connected),
            share()
        );
    }

    ngOnDestroy() {
        this.socket.disconnect();
        this.complete();
    }

    // @ts-ignore
    override next(value: SocketClientEvent): void {
        this.socket.emit(value.event, value.data);
    }

    /**
     * Get an event from the socket.
     * @param event - The event to get.
     * @returns An observable of the event.
     */
    getEvent<T extends SocketEventKeys>(event: T): Observable<SocketEvent<T>> {
        return fromEvent(this.socket, event).pipe(map((data) => ({ event, data }))) as Observable<SocketEvent<T>>;
    }
}