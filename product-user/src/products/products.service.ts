import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { Kafka } from "kafkajs";

export class ProductsService {
    private kafkaProducer; // Kafka producer instance

    constructor(
        /**
         * Repository is used to interact with the database. It is responsible for managing the persistence and retrieval of entities,
         * allowing to perform database operations like CRUD with ease.
         */
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>, // Inject product repository
    ) {
        const kafka = new Kafka({
            clientId: 'nestjs-crud', // Kafka client ID
            brokers: ['localhost:9092'], // Kafka brokers
            retry: {
                retries: 5, // Adjust this number as needed
            },
        });
        this.kafkaProducer = kafka.producer();
        this.kafkaProducer.connect(); // Connect to the kafka producer
    }

    async create(product: Product): Promise<Product> {
        const newProduct = await this.productRepository.save(product); // Save product in DB 
        await this.kafkaProducer.send({// Send Kafka message
            topic: 'product-created', // Topic name
            messages:[
                {
                    value: JSON.stringify(newProduct), // Serialize product data
                }
            ]
        });
        return newProduct; // Return the newly created product
    }

    findAll(isActive: boolean): Promise<Product[]> {
        // Retrieve all products, filtered by active status if provided
        return this.productRepository.find({where: isActive !== undefined ? { isActive } : {}});
    }

    findOne(id: number): Promise<Product> {
        return this.productRepository.findOne({ where: {id}}); // Retrieve a product by ID 
    }

    async update(id: number, product: Product): Promise<Product> {
        await this.productRepository.update(id, product); // Update product in DB 
        const updatedProduct = await this.productRepository.findOne({where: {id}});
        await this.kafkaProducer.send({// Send Kafka message
            topic: 'product-updated',
            messages: [
                {
                    value: JSON.stringify(updatedProduct)
                }
            ]
        });
        return updatedProduct; // Return updated product
    }

    async updatePrice(id: number, price: number): Promise<Product> {
        await this.productRepository.update(id, {price}); // Update product price in DB 
        const updatedProduct = await this.productRepository.findOne({where: {id}}); // Fetch updated product 
        await this.kafkaProducer.send({ // Send Kafka message
            topic : 'price-updated',
            messages: [
                {
                    value: JSON.stringify(updatedProduct),
                }
            ]
        });
        return updatedProduct;
    }

    async applyPriceDrop(id: number, discount:number): Promise<Product> {
        const product = await this.productRepository.findOne({where: {id}});
        if (product) {
            product.price = product.price - discount;
            await this.productRepository.save(product);
            await this.kafkaProducer.send({
                topic: 'price-dropped',
                messages: [
                    {
                        value: JSON.stringify(product),
                    }
                ]
            });
        }
        return product;
    }

    async updateAvailability(id: number, isAvailable: boolean): Promise<Product> {
        await this.productRepository.update(id, {isActive: isAvailable});
        const updatedProduct = await this.productRepository.findOne({where:{id}});
        await this.kafkaProducer.send({
            topic: 'availability-updated',
            messages: [
                {
                    value: JSON.stringify(updatedProduct)
                }
            ]
        });
        return updatedProduct;
    }

    async getRecommendations(id: number): Promise<Product[]> {
        const product = await this.productRepository.findOne({where:{id}});
        if (!product) {
            return [];
        }
        // For simplicity, recommend products in the same price range
        return this.productRepository.find({where:{price:product.price}});
    }

    async remove(id: number): Promise<void> {
        await this.productRepository.delete(id); // Delete product from DB 
        await this.kafkaProducer.send({
            topic: 'product-deleted',
            messages: [
                {
                    value: JSON.stringify({id}), // Serialize deleted product ID
                },
            ],
        });
    }
}