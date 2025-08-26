import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { API_URL, INPUT_SOCKET_EVENTS, OUTPUT_SOCKET_EVENTS, SOCKET_URL } from '@chat-bhp/core/data-access';
import { errorHandlingInterceptor } from '@chat-bhp/core/error-handler';

import { environment } from '../environments/environment';

import { appRoutes } from './app.routes';
import { CLIENT_SOCKET_EVENTS, SERVER_SOCKET_EVENTS } from '@chat-bhp/core/api-types';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([errorHandlingInterceptor])),
    { provide: API_URL, useValue: environment.API_URL },
    { provide: SOCKET_URL, useValue: environment.SOCKET_URL },
    { provide: INPUT_SOCKET_EVENTS, useValue: CLIENT_SOCKET_EVENTS },
    { provide: OUTPUT_SOCKET_EVENTS, useValue: SERVER_SOCKET_EVENTS },
  ],
};
