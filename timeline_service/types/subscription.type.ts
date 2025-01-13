import Post from "../models/post.model";
export enum PostEvent {
  CREATE_POST = "create_post",
  DELETE_POST = "delete_post",
}

export type TOPIC_TYPE = "PostEvents";

export interface MessageType {
  userId: string;
  id: string;
  post: typeof Post;
}
