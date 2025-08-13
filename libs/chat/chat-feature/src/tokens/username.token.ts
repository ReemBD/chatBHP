import { InjectionToken } from "@angular/core";

import { getRandomUsername } from "../utils/chat-user";

/**
 * A random lotr themed username for the chat.
 */
export const USERNAME = new InjectionToken<string>('The username of the user in the chat.', {
    factory: () => getRandomUsername(),
});