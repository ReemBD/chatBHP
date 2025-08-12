import { inject, Injectable } from '@angular/core';
import { ChatMessage, SocketEvent } from '@chat-bhp/core/api-types';
import { USERNAME } from '@chat-bhp/chat/chat-feature'
import { ApiService, SocketService } from '@chat-bhp/core/data-access';
import { catchError, ignoreElements, map, of, retry, scan, shareReplay, startWith, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly username = inject(USERNAME);
  private readonly socket$ = inject(SocketService);
  private readonly api = inject(ApiService);
  private readonly BASE_URL = '/chat';

  private readonly history$ = this.loadHistory().pipe(
    retry(3),
    shareReplay(1)
  );

  readonly error$ = this.history$.pipe(
    ignoreElements(),
    catchError((error) => {
      return of(error);
    }),
  );

  readonly chat$ = this.history$.pipe(
    map(history => history.map(message => ({ ...message, isSender: this.username === message.username }))),
    switchMap((history) => this.socket$
      .getEvent('receiveMessage')
      .pipe(
        startWith({ data: { message: 'Oh hey there bro!', username: 'Gandalf' } } as SocketEvent<"receiveMessage">),
        map(({ data }) => ({ ...data, isSender: this.username === data.username })),
        scan((acc, curr) => [curr, ...acc], history),
      )
    ),
  );

  loadHistory() {
    return this.api.get<ChatMessage[]>(`${this.BASE_URL}/history`);
  }
}