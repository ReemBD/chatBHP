import { inject, Injectable } from '@angular/core';
import { catchError, ignoreElements, map, of, retry, scan, shareReplay, startWith, switchMap } from 'rxjs';

import { ChatMessage, SocketEvent } from '@chat-bhp/core/api-types';
import { USERNAME } from '@chat-bhp/chat/chat-feature'
import { ApiService, SocketService } from '@chat-bhp/core/data-access';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly username = inject(USERNAME);
  private readonly socketService = inject(SocketService);
  private readonly api = inject(ApiService);
  private readonly BASE_URL = '/chat';

  private readonly history$ = this.loadHistory().pipe(
    retry(3),
    shareReplay(1)
  );

  /**
   * A stream of errors from the server.
   */
  readonly error$ = this.history$.pipe(
    ignoreElements(),
    catchError((error) => {
      return of(error);
    }),
  );

  private readonly instructions =
    'Hello There! \n\n If thou seekest the counsel of a wise and ancient wizard, speak thy question boldly.' +
    'Be it about Angular, React, or the many mysterious arts of the frontend realms, I shall illuminate the path with my staff of knowledge and spells of code.'
  /**
   * A stream of messages from the server (including the history).
   */
  readonly chat$ = this.history$.pipe(
    map(history => history.map(message => ({ ...message, isSender: this.username === message.username }))),
    switchMap((history) => this.socketService
      .getEvent('receiveMessage')
      .pipe(
        startWith({ data: { message: this.instructions, username: 'Gandalf' } } as SocketEvent<"receiveMessage">),
        map(({ data }) => ({ ...data, isSender: this.username === data.username })),
        scan((acc, curr) => [...acc, curr], history),
      )
    ),
  );

  /**
   * Load the history from the server.
   */
  loadHistory() {
    return this.api.get<ChatMessage[]>(`${this.BASE_URL}/history`);
  }

  /**
   * Send a message to the server.
   * @param message - The message to send.
   */
  sendMessage(message: string) {
    this.socketService.emit('sendMessage', { message, username: this.username });
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
}