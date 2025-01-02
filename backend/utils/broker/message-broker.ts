import { Consumer, Kafka, Partitioners, Producer } from "kafkajs";

//configuration
const BROKERS = [process.env.BROKER_1 || "localhost:9092"];

const kafka = new Kafka({
  clientId: "posts",
  brokers: BROKERS,
});

let producer: Producer;
let consumer: Consumer;

const connectProducer = async () => {
  //todo: create topic
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
//todo create interface for publish type
const publish = async (data: any) => {
  const producer = await connectProducer();
  const result = await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user" }],
  });
  console.log("publishing result", result);
  return result.length > 0;
};
export const MessageBroker = {
  connectProducer,
  disconnectProducer,
  publish,
};
