import { Kafka } from "kafkajs";

export class KafkaProducerService {
    private kafkaProducer;
    constructor() {
        const kafka = new Kafka({
            clientId: 'auth-service',
            brokers: ['localhost:9092'],
            retry: {
                retries: 5, // Adjust this number as needed
            }
        });
        this.kafkaProducer = kafka.producer();
        this.kafkaProducer.connect();
    }

    async sendAuthEvent(user: any) {
        await this.kafkaProducer.send({
            topic: 'auth-events',
            messages: [{ value: JSON.stringify(user)}]
        })
    }
}