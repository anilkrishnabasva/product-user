import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env', // Specifies the path to the .env file
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Specify database type
      host: process.env.DB_HOST || 'localhost', // Database host from environment or default
      port: parseInt(process.env.DB_PORT,10) || 5432, // Database port
      username: process.env.DB_USERNAME || 'postgres', // Database username
      password: process.env.DB_PASSWORD || 'anilkrishnabasva', // Database password
      database: process.env.DB_NAME || 'nestjs_crud', // Database name
      autoLoadEntities: true, // Automatically load entities (or we can mention entities manually Ex: - [User])
      synchronize: true, // Sync schema, disable for production
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerService],
})
export class AppModule {}
