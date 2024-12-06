import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * @Entity() decorator is used when working with TypeORM to define a class as a database entity(i.e., a table in a relational database).
 * TypeORM is an Object-Relational Mapper for TypeScript and Javascript, and used to interact with SQL databases like MySQL, PostgreSQL, SQLite, etc.
 */
@Entity()
export class Product {
    @PrimaryGeneratedColumn() // Defines the primary key column 
    id: number; // Auto-increment

    @Column() // Regular string column 
    name: string;

    @Column() // Numeric column
    price: number;

    @Column() // String column for descriptions
    description: string;

    @Column({ default: true }) // Boolean column for active status
    isActive: boolean;
}