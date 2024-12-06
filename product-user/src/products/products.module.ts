import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Product]), AuthModule], // register product entity
    controllers: [ProductsController], // Register controller
    providers: [ProductsService], // Register service 
})

export class ProductsModule {}