import {
  MessageType,
  PostEvent,
  TOPIC_TYPE,
} from "../../types/subscription.type";

export interface PublishType {
  headers: Record<string, any>;
  topic: TOPIC_TYPE;
  event: PostEvent;
  message: Record<string, any>;
}

export type MessageHandler = (input: MessageType) => void;
