export interface ChatMessage {
    message: string;
    username: string;
    timestamp: string;
}

/**
 * The possible names of the chatbot.
 */
export type ChatBotName = 'Gandalf' | 'Sauron' | 'Michael Scott';

/**
 * A utility function to check if a string is a valid chatbot name.
 */
export const isChatBotName = (name: string): name is ChatBotName => {
    return ['Gandalf', 'Sauron', 'Michael Scott'].includes(name);
};