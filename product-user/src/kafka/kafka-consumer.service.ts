import { OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka } from "kafkajs";

export class KafkaConsumerService implements OnModuleInit {
    private readonly consumer: Consumer;
    private readonly consumerAuth: Consumer;

    constructor() {
        const kafka = new Kafka({
            clientId: 'nestjs-crud-consumer',
            brokers: ['localhost:9092'],
        });
        // const kafkaAuthService = new Kafka({
        //     clientId: 'nestjs-auth-service',
        //     brokers: ['localhost:9092'],
        // });
        this.consumer = kafka.consumer({groupId: 'nestjs-group'});
        this.consumerAuth = kafka.consumer({groupId: 'auth-group'});
    }

    async onModuleInit() {
        await this.consumer.connect();
        await this.consumerAuth.connect();
        await this.consumer.subscribe({topic: 'product-created', fromBeginning: true});
        await this.consumer.subscribe({topic: 'price-updated', fromBeginning: true});
        await this.consumerAuth.subscribe({ topic: 'auth-events', fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Consumed message from ${topic}:`, message.value.toString());
            }
        });
        await this.consumerAuth.run({
            eachMessage: async ({ topic, partition, message }) => {
                const authEvent = JSON.parse(message.value.toString());
                console.log(`Received ${topic}:`, authEvent);
            }
        });
    }
}