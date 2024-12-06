import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { KafkaModule } from './kafka/kafka.module';
import { KafkaConsumerService } from './kafka/kafka-consumer.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    /**
     * Loads environment variables (e.g., from .env files) and makes them available throughout application using a configuration service.
     * This helps centralize and simplify the configuration process, especiaaly for managing environment-specific settings.
     * By specifying {isGlobal: true}, configuration accessible across entire application without needing to import ConfigModule in each module explicitly.
     * 
     */
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
      synchronize: true, // Sync schema
    }),
    ProductsModule,
    KafkaModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaConsumerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AppModule {}
