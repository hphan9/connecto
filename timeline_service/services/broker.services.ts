import { Message } from "kafkajs";
import { MessageBroker } from "../utils/broker";
import { PostEvent } from "../types/subscription.type";
import { createPostHandler } from "./timeline.service";

// initialize the broker
export const InitializeBroker = async () => {
  //todo : remove producer since we don't need to use it here
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
  await MessageBroker.subscribe(createPostHandler, "PostEvents");
};

