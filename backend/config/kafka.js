import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "cnectify-backend",
  brokers: [process.env.Kafka_broker],
});

export const producer = kafka.producer();
