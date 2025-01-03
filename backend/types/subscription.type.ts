export enum PostEvent {
  CREATE_POST = "create_post",
  DELETE_POST = "delete_post",
}

export type TOPIC_TYPE = "PostEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: PostEvent;
  data: Record<string, any>;
}
