import { ChatMessage as ChatMessageApi } from '@chat-bhp/core/api-types';

export interface ChatMessage extends ChatMessageApi {
  isSender: boolean;
}