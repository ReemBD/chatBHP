import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, delay, distinctUntilChanged, filter, map, merge, of, retry, scan, shareReplay, startWith, switchMap, take, tap } from 'rxjs';

import { ChatMessage, ChatMappings, CLIENT_SOCKET_EVENTS, SERVER_SOCKET_EVENTS, SocketEvent } from '@chat-bhp/core/api-types';
import { USERNAME } from '@chat-bhp/chat/chat-feature'
import { ApiService, SocketService } from '@chat-bhp/core/data-access';

type CallState = 'init' | 'loading' | 'loaded' | { error: string };

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly username = inject(USERNAME);
  private readonly socketService = inject(SocketService);
  private readonly api = inject(ApiService);
  private readonly BASE_URL = '/chat';

  private readonly instructions =
    'Hello There! \n\n If thou seekest the counsel of a wise and ancient wizard, speak thy question boldly.' +
    'Be it about Angular, React, or the many mysterious arts of the frontend realms, I shall illuminate the path with my staff of knowledge and spells of code.'


  private readonly callState$$ = new BehaviorSubject<CallState>('init');
  readonly callState$ = this.callState$$.asObservable();
  readonly isLoading$ = this.callState$.pipe(map(state => state === 'loading'));
  readonly error$ = this.callState$.pipe(
    map((state) => typeof state === 'object' ? state.error : undefined),
    filter(error => !!error),
  );

  private readonly data$ = of(null).pipe(
    tap(() => this.callState$$.next('loading')),
    switchMap(() => combineLatest([
      this.loadHistory().pipe(retry(3)),
      this.loadChatMappings().pipe(retry(3)),
    ])),
    tap(() => this.callState$$.next('loaded')),
  )

  private readonly chatMappings$ = this.data$.pipe(
    map(([_, chatMappings]) => chatMappings),
    distinctUntilChanged(),
    shareReplay(1),
  );

  private readonly history$ = this.data$.pipe(
    map(([history]) => history),
    distinctUntilChanged(),
    shareReplay(1),
  );

  /**
   * A stream of messages from the server (including the history).
   */
  readonly chat$ = this.history$.pipe(
    map(history => history.map(message => ({ ...message, isSender: this.username === message.username }))),
    switchMap((history) => this.socketService
      .getEvent(SERVER_SOCKET_EVENTS.chatMessage)
      .pipe(
        startWith({ data: { message: this.instructions, username: 'Gandalf' } } as SocketEvent<"chatMessage">),
        map(({ data }) => ({ ...data, isSender: this.username === data.username })),
        scan((acc, curr) => [...acc, curr], history),
      )
    ),
  );

  readonly connect$ = merge(
    this.socketService.getEvent(SERVER_SOCKET_EVENTS.chatJoin).pipe(
      map(({ data }) => ({ type: 'join', data })),
    ),
    this.socketService.getEvent(SERVER_SOCKET_EVENTS.chatLeave).pipe(
      map(({ data }) => ({ type: 'leave', data })),
    )
  );

  readonly connections$ = this.connect$.pipe(
    map(({ data }) => data.username),
    scan((acc, curr) => [...acc, curr], [] as string[]),
    shareReplay(1),
  );

  /**
   * Send a message to the server.
   * @param message - The message to send.
   */
  sendMessage(message: string) {
    this.socketService.next({ event: CLIENT_SOCKET_EVENTS.chatMessage, data: { message, username: this.username } })
  }

  joinChat() {
    this.socketService.connected$.pipe(
      filter(connected => connected),
      take(1),
      tap(() => { this.socketService.next({ event: CLIENT_SOCKET_EVENTS.chatJoin, data: { username: this.username } }) })
    )
      .subscribe();
  }

  leaveChat() {
    this.socketService.next({ event: CLIENT_SOCKET_EVENTS.chatLeave, data: { username: this.username } });
  }

  /**
   * Create a temporary message for the chat.
   * Used for optimsitc updates.
   */
  createTempMessage(message: string) {
    return {
      message,
      timestamp: new Date().toISOString(),
      username: this.username,
      isSender: true,
    };
  }


  private loadHistory() {
    this.callState$$.next('loading');
    return this.api.get<ChatMessage[]>(`${this.BASE_URL}/history`).pipe(
      // Mock a delay to simulate a loading state
      delay(2000),
      catchError((error) => {
        this.callState$$.next({ error: error.message || 'Unknown error' });
        throw error;
      }),
      tap(() => this.callState$$.next('loaded')),
    );
  }

  /**
   * Load chat mappings from the server.
   * @returns Observable of chat mappings
   */
  loadChatMappings() {
    return this.api.get<ChatMappings>(`${this.BASE_URL}/mappings`);
  }
}