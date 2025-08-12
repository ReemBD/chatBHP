import { inject, Injectable } from "@angular/core";
import { filter, Observable } from "rxjs";
import { io, Socket } from "socket.io-client";

import { SocketEvent, SocketEventKeys } from "@chat-bhp/core/api-types";

import { SOCKET_URL } from "./api-url.token";


@Injectable({
    providedIn: 'root'
})
export class SocketService extends Observable<SocketEvent> {
    readonly socket: Socket;

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
    }

    getEvent<T extends SocketEventKeys>(event: T): Observable<SocketEvent<T>> {
        return this.pipe(filter(({ event: e }) => e === event)) as Observable<SocketEvent<T>>;
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}