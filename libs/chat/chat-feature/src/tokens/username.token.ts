import { InjectionToken } from "@angular/core";
import { getRandomUsername } from "../utils/chat-user";

/**
 * An arbitrary username for the chat.
 */
export const USERNAME = new InjectionToken<string>('An arbitrary username for the chat.', {
    factory: () => getRandomUsername(),
});