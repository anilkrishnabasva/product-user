import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { KafkaProducerService } from "src/kafka/kafka-producer.service";

export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private kafkaProducerService: KafkaProducerService
    ) {}

    async create(username: string, password: string, role: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({username, password: hashedPassword, role});
        const savedUser = await this.userRepository.save(newUser);

        // Send Kafka event after the user is created
        await this.kafkaProducerService.sendAuthEvent({
            id: savedUser.id,
            username: savedUser.username,
            role: savedUser.role,
            eventType: 'USER_CREATED'
        });

        return savedUser;
    }

    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ where: {username}});
    }
}