import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { API_URL, SOCKET_URL } from '@chat-bhp/core/data-access';
import { errorHandlingInterceptor } from '@chat-bhp/core/error-handler';

import { environment } from '../environments/environment';

import { appRoutes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([errorHandlingInterceptor])),
    { provide: API_URL, useValue: environment.API_URL },
    { provide: SOCKET_URL, useValue: environment.SOCKET_URL },
  ],
};
