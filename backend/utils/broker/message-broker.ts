import { Consumer, Kafka, logLevel, Partitioners, Producer } from "kafkajs";
import { PublishType } from "./broker.type";

//configuration
const BROKERS = [process.env.BROKER_1 || "localhost:9092"];

const kafka = new Kafka({
  clientId: "postservice",
  brokers: BROKERS,
  logLevel: logLevel.INFO,
});

let producer: Producer;
let consumer: Consumer;

const connectProducer = async () => {
  //todo: creating topic is responsible of Producer
  if (producer) {
    console.log("producer already connected with existing connection");
    return producer;
  }
  producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  console.log("producer connected with new connection");
  return producer;
};

const disconnectProducer = async () => {
  if (producer) {
    await producer.disconnect();
  }
};

const publish = async (data: PublishType) => {
  const producer = await connectProducer();
  const result = await producer.send({
    topic: "PostEvents",
    messages: [
      {
        headers: data.headers,
        key: data.event,
        value: JSON.stringify(data.message),
      },
    ],
  });
  console.log("publishing result", result);
  return result.length > 0;
};

const connectConsumer = async () => {
  //todo: create consumer
  if (consumer) {
    console.log("consumer already connected with existing connection");
    return consumer;
  }
  //
  consumer = kafka.consumer({ groupId: "following-posts" });
  await consumer.connect();
  console.log("consumer connected with new connection");
  return consumer;
};

const subscribe = async (messageHandler: any, topic: string) => {
  // connect consumer
  const consumer = await connectConsumer();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic != "PostEvents") {
        return;
      }
      console.log(message.key);
      if (message.key && message.value) {
        const inputMessage = JSON.parse(message.value.toString());
        await messageHandler(inputMessage);
        await consumer.commitOffsets([
          { topic, partition, offset: (Number(message.offset) + 1).toString() },
        ]);
      }
    },
  });
};

const disconnectConsumer = async () => {
  if (consumer) {
    await consumer.disconnect();
  }
};

export const MessageBroker = {
  connectProducer,
  disconnectProducer,
  publish,
  connectConsumer,
  subscribe,
  disconnectConsumer,
};
