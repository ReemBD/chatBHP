import { InjectionToken } from '@angular/core';

/**
 * The api url of the server.
 */
export const API_URL = new InjectionToken<string>('The api url of the server.');

/**
 * The socket url of the server.
 */
export const SOCKET_URL = new InjectionToken<string>('The socket url of the server.');