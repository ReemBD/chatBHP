import { Pipe, PipeTransform } from "@angular/core";

import { getRandomColor } from "../utils/chat-user";

const userColors = new Map<string, string>();

/**
 * A pipe to get a random color for a username.
 * The color is stored in a map and is used to color the username in the chat.
 */
@Pipe({
    name: 'chatUserColor',
    standalone: true,
})
export class ChatUserColorPipe implements PipeTransform {
    transform(username: string): string {
        if (!userColors.has(username)) {
            userColors.set(username, getRandomColor());
        }
        return userColors.get(username) || getRandomColor();
    }
}