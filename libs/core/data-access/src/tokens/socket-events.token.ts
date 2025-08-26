import { InjectionToken } from "@angular/core";

/**
 * Used to provide the input socket events.
 * For client this would be server events.
 */
export const INPUT_SOCKET_EVENTS = new InjectionToken<Record<string, string>>('The input socket events');

/**
 * Used to provide the output socket events.
 * For client this would be client events.
 */
export const OUTPUT_SOCKET_EVENTS = new InjectionToken<Record<string, string>>('The output socket events');
