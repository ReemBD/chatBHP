import { InjectionToken } from "@angular/core";

export const TOPIC_WELCOME_MESSAGE_MAP = new InjectionToken<Record<string, string>>('The welcome message map for each chat topic.');