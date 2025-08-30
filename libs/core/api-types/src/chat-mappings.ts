import { ChatMessage } from './chat';

export type ChatTopic = 'frontend';

export type ChatMappings = {
    topicWelcomeMessageMap: Record<ChatTopic, ChatMessage>;
}