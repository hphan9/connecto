import { Message } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { PostEvent } from "../types/subscription.type";

// initialize the broker
export const InitializeBroker = async () => {
  const producer = await MessageBroker.connectProducer();
  producer.on("producer.connect", () => {
    console.log("producer connected successfully");
  });
  const consumer = await MessageBroker.connectConsumer();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected successfully");
  });

  // keep listening to consuemers events
  // perform the action based on the event
  await MessageBroker.subscribe((message: Message) => {
    console.log("Message", message);
    // todo: create HandleMessage for PostEvents
  }, "PostEvents");
};

//publish dedicated events

export const SendCreatePostMessage = async (data: any) => {
  await MessageBroker.publish({
    event: PostEvent.CREATE_POST,
    topic: "PostEvents",
    headers: {},
    message: data,
  });
};
